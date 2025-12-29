function delay(ms) {
    return new Promise(res => setTimeout(res, ms));
}

async function controlledSend(list, sendFn) {
    for (const item of list) {
        await sendFn(item);
        await delay(8000 + Math.random() * 5000); // 8–13s
    }
}

module.exports = { controlledSend };
