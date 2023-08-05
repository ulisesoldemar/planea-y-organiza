// middlewares/authMiddleware.js
const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const Admin = require('../models/Admin'); // Importar el modelo Admin

// Definir la estrategia de autenticación de Passport
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_secret_key_here',
};

passport.use(new Strategy(jwtOptions, async (payload, done) => {
    try {
        const admin = await Admin.findById(payload.id);
        if (admin) {
            return done(null, admin);
        } else {
            return done(null, false);
        }
    } catch (error) {
        return done(error, false);
    }
}));

// Middleware para proteger rutas que requieren autenticación
const requireAuth = passport.authenticate('jwt', { session: false });

module.exports = {
    requireAuth,
};
