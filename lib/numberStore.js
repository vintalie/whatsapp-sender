const store = require('./store');

function saveCheckedNumber({ number, valid, saved, source }) {

    store.numbersDB.push({
        number,
        valid,
        saved,
        source, // 'generator' | 'csv'
        checkedAt: new Date().toISOString()
    });
}

function getAllNumbers() {
    return store.numbersDB;
}

function clearNumbers() {
    store.numbersDB.length = 0;
}

module.exports = {
    saveCheckedNumber,
    getAllNumbers,
    clearNumbers
};
