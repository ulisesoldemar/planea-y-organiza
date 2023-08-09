const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const userBaseSchema = require('./user.model'); // Importar el esquema base

const userAdminSchema = new Schema({
    ...userBaseSchema.obj, // Extender con los campos del esquema base
    username: { type: String, unique: true },
    password: { type: String, select: false }
});

const UserAdmin = model('UserAdmin', userAdminSchema);

module.exports = UserAdmin;
