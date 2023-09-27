require('dotenv').config();

const { startExpressServer, socketServer } = require('./src/server');

async function main() {
    await startExpressServer();
    socketServer.listen(process.env.WS_PORT);
}

main();