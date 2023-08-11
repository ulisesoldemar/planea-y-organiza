const mongoose = require('mongoose');
const { Schema } = mongoose;

const userBaseSchema = new Schema({
    firstName: { type: String, required: true },
    surName: { type: String, required: true },
    secondSurName: { type: String, required: false },
    email: { type: String, unique: true },
});

module.exports = userBaseSchema;
