const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userAdminSchema = new Schema({
    firstName: { type: String, required: true },
    surName: { type: String, required: true },
    secondSurName: { type: String, required: false },
    email: { type: String, unique: true },
    password: { type: String, select: false },
    username: { type: String, unique: true },
    rooms: [{ type: Schema.Types.ObjectId, ref: 'Room' }]
});

const UserAdmin = model('UserAdmin', userAdminSchema);

module.exports = UserAdmin;
