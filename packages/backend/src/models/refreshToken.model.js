const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const refreshTokenSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        refPath: 'ownerModel'
    },
    ownerModel: {
        type: String,
        required: true,
        enum: ['Player', 'UserAdmin']
    }
});

const RefreshToken = model('RefreshToken', refreshTokenSchema);

module.exports = RefreshToken;
