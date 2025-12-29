const express = require('express');
const multer = require('multer');
const path = require('path');
const { parseCSV } = require('./lib/csvParser');
const { clearNumbers, getAllNumbers, saveCheckedNumber } = require('./lib/numberStore');
const { readTemplates } = require('./lib/fakeDB');
const db = require('./lib/fakeDB');

const { controlledSend } = require('./lib/rateLimiter');
/* WHATSAPP */
const {
    connectWhatsApp,
    getQRCode,
    isWhatsAppConnected,
    sendMessage,
    getSocket
} = require('./lib/whatsapp');

/* CSV VALIDATION */
const { startValidation } = require('./lib/validationJob');
const store = require('./lib/store');

/* NUMBER GENERATOR */
const { generateNumber } = require('./lib/generator');
const {
    validateNumber,
    saveNumber,
    initCSV,
    OUTPUT
} = require('./lib/validator');

/* MESSAGE TEMPLATES */
const {
    listTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    testMessage
} = require('./lib/messageController');

const app = express();

/* ===========================
   MULTER CONFIG
=========================== */

// CSV upload
const csvUpload = multer({
    dest: 'uploads/csv'
});

// Image upload (templates)
const imageUpload = multer({
    dest: 'uploads/images',
    fileFilter(req, file, cb) {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Apenas imagens são permitidas'));
        }
        cb(null, true);
    }
});

/* ===========================
   MIDDLEWARES
=========================== */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* ===========================
   START WHATSAPP
=========================== */

connectWhatsApp();

/* ===========================
   PAGES
=========================== */

app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/csv', (_, res) => {
    res.sendFile(path.join(__dirname, 'public/csv.html'));
});

app.get('/generate', (_, res) => {
    res.sendFile(path.join(__dirname, 'public/generate.html'));
});

app.get('/message', (_, res) => {
    res.sendFile(path.join(__dirname, 'public/message.html'));
});

/* ===========================
   QR STATUS
=========================== */

app.get('/qrcode', (_, res) => {
    res.json({
        qr: getQRCode(),
        connected: isWhatsAppConnected()
    });
});

/* ===========================
   CSV VALIDATION
=========================== */


app.post('/upload', csvUpload.single('csv'), async (req, res) => {
    if (!isWhatsAppConnected()) {
        return res.send('WhatsApp não conectado');
    }

    try {
        const numbers = await parseCSV(req.file.path); // ← ARRAY REAL
        startValidation(numbers);
        res.redirect('/csv');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao processar CSV');
    }
});



/* ===========================
   GENERATE + VALIDATE
=========================== */

app.post('/start', async (req, res) => {
    const { prefix, amount } = req.body;
    if (store.job.running) return res.json({ error: 'Job já em execução' });

    initCSV();
    clearNumbers(); // 🔥 limpa histórico anterior

    store.job = {
        running: true,
        total: amount,
        generated: 0,
        current: null,
        last: null,
        saved: false,
        error: null
    };

    res.json({ started: true });

    for (let i = 0; i < amount; i++) {
        try {
            const number = generateNumber(prefix);
            store.job.current = number;

            const valid = await validateNumber(number, 'generator');

            store.job.last = number;
            store.job.saved = valid;
            store.job.generated++;

            await new Promise(r => setTimeout(r, 1200));
        } catch {
            store.job.error = 'Erro ao validar número';
        }
    }

    store.job.running = false;
});


app.get('/api/status', (_, res) => {
    res.json(store.job);
});

app.get('/download', (_, res) => {
    res.download(OUTPUT);
});





app.get('/api/validation', (req, res) => {
    const data = db.read();
    const v = data.validation;

    let last = null;
    if (v.history.length > 0) {
        const h = v.history[v.history.length - 1];
        last = {
            number: h.number,
            status: h.status
        };
    }

    let next = null;
    if (v.status === 'running' && v.numbers[v.currentIndex + 1]) {
        next = {
            number: v.numbers[v.currentIndex + 1],
            status: 'Rodando'
        };
    }

    res.json({
        status: v.status,
        index: v.currentIndex,
        total: Array.isArray(v.numbers) ? v.numbers.length : 0,
        last,
        next
    });
});




/* ===========================
   MESSAGE TEMPLATES
=========================== */





app.get('/api/templates', listTemplates);

app.post(
    '/api/templates',
    imageUpload.single('image'),
    createTemplate
);


app.get('/message/:id/template-view', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/template-view.html'));
});


app.put('/api/templates', updateTemplate);

app.delete('/api/templates/:id', deleteTemplate);

app.post('/api/templates/test', testMessage);

app.post('/api/templates/:id/test', async (req, res) => {
    const { number } = req.body;
    const { id } = req.params;

    try {

        const templates = readTemplates();

        const template = templates.find(t => t.id == id);

        if (!template) {
            return res.status(404).json({
                status: 'error',
                message: 'Template não encontrado'
            });
        }


        await sendMessage(
            number,
            template.text,
            template.image || null
        );

        res.json({
            status: 'success',
            message: 'Mensagem de teste enviada com sucesso'
        });

    } catch (err) {
        console.error(err);
        res.json({
            status: 'error',
            message: 'Erro ao enviar mensagem',
            detail: err.message
        });
    }
});


app.get('/api/numbers', (req, res) => {
    const data = db.read();
    res.json(data.numbers);
});



app.get('/status', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public/status.html'));
});

app.post('/api/sendAll', async (req, res) => {
    const { templateId } = req.body;
    const template = readTemplates().find(t => t.id == templateId);
    if (!template) return res.status(404).json({ message: 'Template não encontrado' });

    const numbers = getAllNumbers();
    const results = [];
    // const socket = getSocket()
    await controlledSend(numbers, async (n) => {
        try {
            await sendMessage(n.number, template.text, template.image);
            results.push({ number: n.number, status: 'success' });
        } catch (err) {
            results.push({ number: n.number, status: 'error', error: err.message });
        }
    });


    res.json({ results });
});

/* ===========================
   SERVER
=========================== */

app.listen(3000, () => {
    console.log('🚀 Servidor rodando em http://localhost:3000');
});
