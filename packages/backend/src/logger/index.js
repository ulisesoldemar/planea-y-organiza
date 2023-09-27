const pino = require('pino');

const logger = pino({
    transport: {
        targets: [
            {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                }
            },
            {
                target: 'pino/file',
                level: 'error',
                options: {
                    destination: `${__dirname}/error.log`,
                },
            },
        ],
    },
});

module.exports = logger;