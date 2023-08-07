const express = require('express');
const routes = require('./routes');
const cors = require('cors')
const connectToDatabase = require('./database');


const app = express();
const port = process.env.PORT || 3000
const corsOptions = {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use('/api', routes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500)
        .send({ error: err.message });
});

async function startServer() {
    await connectToDatabase();

    app.listen(port, () => {
        console.log(`Server listening at http://localhost:${port}`);
    });
}

module.exports = startServer;