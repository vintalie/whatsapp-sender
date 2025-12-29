const db = require('./fakeDB');
const { validateNumber } = require('./validator');

async function startValidation(numbers) {
    if (!Array.isArray(numbers)) {
        throw new Error('startValidation espera um array de números');
    }

    const data = db.read();

    data.validation = {
        status: 'running',
        currentIndex: -1,
        numbers,
        history: []
    };

    db.write(data);

    for (let i = 0; i < numbers.length; i++) {
        const number = numbers[i];

        data.validation.currentIndex = i;
        db.write(data);

        const valid = await validateNumber(number);

        const entry = {
            number,
            status: valid ? 'Válido' : 'Inválido',
            checkedAt: new Date().toISOString()
        };

        data.validation.history.push(entry);

        data.numbers.push({
            number,
            valid,
            source: 'csv',
            checkedAt: entry.checkedAt
        });

        db.write(data);
    }

    data.validation.status = 'done';
    db.write(data);
}

module.exports = { startValidation };
