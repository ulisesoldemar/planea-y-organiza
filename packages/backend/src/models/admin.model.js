const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userAdminSchema = new Schema({
    firstName: { type: String, required: true },
    surName: { type: String, required: true },
    secondSurName: { type: String, required: false },
    email: { type: String, unique: true },
    password: { type: String, select: false },
    username: { type: String, unique: true },
    superAdmin: { type: Boolean, required: true},
    avatarColor: {
        bkColor: { type: String, required: false},
        textColor: { type: String, required: false},
    },
});

//superAdmin: 1 => SuperAdmin    ||    superAdmin: 0 => normal admin

const UserAdmin = model('UserAdmin', userAdminSchema);

module.exports = UserAdmin;
