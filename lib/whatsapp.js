const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion
} = require('@whiskeysockets/baileys');
const fs = require('fs');
const QRCode = require('qrcode');
const path = require('path');

let sock;
let qrCodeBase64 = null;
let isConnected = false;

async function connectWhatsApp() {
    const authPath = path.resolve('./auth');

    const { state, saveCreds } = await useMultiFileAuthState(authPath);
    const { version } = await fetchLatestBaileysVersion();

    sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: true, // IMPORTANTE para debug
        connectTimeoutMs: 60_000,
        defaultQueryTimeoutMs: 60_000,
        keepAliveIntervalMs: 25_000
    });

    sock.ev.on('creds.update', async () => {
        await saveCreds();
        console.log('💾 Credenciais salvas');
    });

    sock.ev.on('connection.update', async (update) => {
        const { connection, qr, lastDisconnect } = update;

        if (qr) {
            qrCodeBase64 = await QRCode.toDataURL(qr);
            console.log('📲 QR Code gerado');
        }

        if (connection === 'open') {
            isConnected = true;
            qrCodeBase64 = null;
            console.log('✅ WhatsApp conectado com sucesso');
        }

        if (connection === 'close') {
            isConnected = false;
            const code = lastDisconnect?.error?.output?.statusCode;
            console.log('❌ Conexão fechada:', code);

            if (code !== DisconnectReason.loggedOut) {
                console.log('🔄 Tentando reconectar...');
                setTimeout(connectWhatsApp, 5000);
            }
        }
    });
}

function getSocket() {
    return sock;
}

function getQRCode() {
    return qrCodeBase64;
}

function isWhatsAppConnected() {
    return isConnected;
}


function setSocket(s) {
    sock = s;
}

async function sendMessage(number, text, image) {
    console.log(number)
    const jid = number.replace(/\D/g, '') + '@s.whatsapp.net';

    if (image) {
        await sock.sendMessage(jid, {
            image: fs.readFileSync('.' + image),
            caption: text
        });
    } else {
        await sock.sendMessage(jid, { text });
    }
}

module.exports = {
    connectWhatsApp,
    getSocket,
    setSocket,
    sendMessage,
    getQRCode,
    isWhatsAppConnected
};
