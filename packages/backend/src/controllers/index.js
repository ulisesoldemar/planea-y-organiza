const auth = require('./auth.controller');
const admins = require('./admins.controller');
const rooms = require('./rooms.controller');
const players = require('./player.controller');

module.exports = {
    auth,
    admins,
    rooms,
    players
};