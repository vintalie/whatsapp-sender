const db = require('./fakeDB');
// const { v4: uuid } = require('uuid');
function generateId() {
    return 'tpl_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
}

/* LISTAR TEMPLATES */
function listTemplates(req, res) {
    const data = db.read();
    res.json(data.templates);
}


/* CRIAR TEMPLATE */
function createTemplate(req, res) {
    const { title, message } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const data = db.read();

    const template = {
        id: generateId(),
        title,
        message,
        image,
        createdAt: new Date().toISOString()
    };

    data.templates.push(template);
    db.write(data);

    res.json({ success: true, template });
}

/* ATUALIZAR TEMPLATE */
function updateTemplate(req, res) {
    const { id, title, message } = req.body;
    const data = db.read();

    const tpl = data.templates.find(t => t.id === id);
    if (!tpl) return res.status(404).json({ error: 'Template não encontrado' });

    tpl.title = title;
    tpl.message = message;

    db.write(data);
    res.json({ success: true });
}

/* EXCLUIR TEMPLATE */
function deleteTemplate(req, res) {
    const { id } = req.params;
    const data = db.read();

    data.templates = data.templates.filter(t => t.id !== id);
    db.write(data);

    res.json({ success: true });
}

/* ENVIAR TESTE */
async function testMessage(req, res) {
    const { id, number } = req.body;
    const data = db.read();

    const template = data.templates.find(t => t.id === id);
    if (!template) {
        return res.status(404).json({ error: 'Template não encontrado' });
    }

    const { sendMessage } = require('./whatsapp');

    try {
        await sendMessage(number, template.message, template.image);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    listTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    testMessage
};
