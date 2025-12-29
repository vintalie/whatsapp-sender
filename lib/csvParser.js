const fs = require('fs');

function parseCSV(path) {
    const content = fs.readFileSync(path, 'utf-8');

    return content
        .split('\n')
        .map(l => l.trim())
        .filter(l => l && l !== 'telefone'); // remove header
}

module.exports = { parseCSV };
