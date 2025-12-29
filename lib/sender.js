const { controlledSend } = require('./rateLimiter');

async function sendMessages(sock, jids, message) {
    await controlledSend(jids, async (jid) => {
        await sock.sendMessage(jid, { text: message });
    });
}

module.exports = { sendMessages };
