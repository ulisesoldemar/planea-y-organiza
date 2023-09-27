const logger = require('../logger');

class HttpError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        logger.error(`Error HTTP ${statusCode}: ${message}`); // Registra el error con el logger
    }
}

module.exports = HttpError;
