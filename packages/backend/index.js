require('dotenv').config();

const { startExpressServer, socketServer } = require('./src/server');

async function main() {
    await startExpressServer();
    socketServer.listen(3001);
}

main();