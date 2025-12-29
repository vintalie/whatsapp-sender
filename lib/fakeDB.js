const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const DATA_FILE = path.join(DATA_DIR, 'data.json');

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({
        whatsapp: { connected: false, lastUpdate: null },
        validation: { status: 'idle', currentIndex: -1, numbers: [], history: [] },
        generator: { running: false, total: 0, generated: 0, current: null, last: null, error: null },
        numbers: [],
        templates: []
    }, null, 2));
}

function read() {
    return JSON.parse(fs.readFileSync(DATA_FILE));
}

function write(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

module.exports = {
    read,
    write
};
