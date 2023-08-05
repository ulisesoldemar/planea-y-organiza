// models/Admin.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

// Antes de guardar el Admin en la base de datos, hasheamos la contraseña con bcrypt
adminSchema.pre('save', async function (next) {
    const admin = this;
    if (!admin.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(admin.password, salt);
        admin.password = hash;
        return next();
    } catch (err) {
        return next(err);
    }
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
