const express = require('express');
const cors = require('cors');

const routes = require('../routes');
const connectToDatabase = require('../database');
const logger = require('../logger');

const app = express();
const port = process.env.PORT || 3000;
const corsOptions = {
    origin: process.env.CORS_ORIGIN.split(','),
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api', routes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).send({ error: err.message });
});

async function startExpressServer() {
    await connectToDatabase();

    app.listen(port, () => {
        logger.info(`Server listening at http://localhost:${port}`);
    });
}

module.exports = { app, startExpressServer };
