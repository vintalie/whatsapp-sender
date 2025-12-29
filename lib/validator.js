const fs = require('fs');
const path = require('path');
const { getSocket } = require('./whatsapp');
const { saveCheckedNumber } = require('./numberStore');

const OUTPUT_DIR = path.join(process.cwd(), 'output');
const OUTPUT = path.join(OUTPUT_DIR, 'valid_numbers.csv');

function initCSV() {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    fs.writeFileSync(OUTPUT, 'telefone\n');
}

function normalize(number) {
    return number.replace(/\D/g, '');
}

async function validateNumber(number, source = 'generator') {
    let valid = false;
    let saved = false;

    try {
        const sock = getSocket();
        if (!sock) throw new Error('WhatsApp não conectado');

        const jid = `${normalize(number)}@s.whatsapp.net`;
        const result = await sock.onWhatsApp(jid);

        valid = result?.[0]?.exists === true;

        if (valid) {
            fs.appendFileSync(OUTPUT, `${number}\n`);
            saved = true;
        }

    } catch (err) {
        console.error('Erro validação:', err.message);
    }

    // 🔥 SALVA SEMPRE NO FAKE DB
    saveCheckedNumber({
        number,
        valid,
        saved,
        source
    });

    return valid;
}

module.exports = {
    validateNumber,
    initCSV,
    OUTPUT
};
