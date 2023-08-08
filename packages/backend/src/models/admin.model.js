const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userAdminSchema = new Schema({
    email: { type: String, unique: true },
    username: { type: String, unique: true },
    password: { type: String, select: false }
});

const UserAdmin = model('UserAdmin', userAdminSchema);

module.exports = UserAdmin;