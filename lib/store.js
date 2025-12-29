module.exports = {
    validation: {
        status: 'idle',
        numbers: [],
        currentIndex: -1,
        lastChecked: null
    },

    job: {
        running: false,
        total: 0,
        generated: 0,
        current: null,
        last: null,
        saved: false,
        error: null
    },

    // 🔥 NOVO: banco fictício de números
    numbersDB: []
};
