const mongoose = require('mongoose');
const { Schema } = mongoose;

const userBaseSchema = new Schema({
    firstName: { type: String, required: true },
    firstLastName: { type: String, required: true },
    secondLastName: { type: String, required: false },
    email: { type: String, unique: true },
});

module.exports = userBaseSchema;
