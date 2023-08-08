const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
    firstName: {},
    email: { type: String, unique: true },
});

const User = model('User', userSchema);

module.exports = User;