function generateNumber(prefix) {
    const suffix = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, '0');

    return `${prefix} ${suffix}`;
}

module.exports = { generateNumber };
