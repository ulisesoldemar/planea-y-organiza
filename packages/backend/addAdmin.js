const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('./models/Admin'); // Asegúrate de ajustar la ruta según la ubicación de tu modelo Admin

// Configurar conexión a la base de datos MongoDB
mongoose.connect('mongodb://127.0.0.1/planea-y-organiza', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Datos del administrador de ejemplo
const adminData = {
    email: 'jjuarez@academicos.udg.mx',
    username: 'jjuarez', // Cambia esto por el nombre de usuario deseado
    password: 'admin123', // Cambia esto por la contraseña deseada
};

// Función para agregar un administrador a la base de datos
async function addAdmin() {
    try {
        // Verificar si ya existe un administrador con el mismo nombre de usuario
        const existingAdmin = await Admin.findOne({ username: adminData.username });
        if (existingAdmin) {
            console.log('Ya existe un administrador con este nombre de usuario.');
            return;
        }

        // Crear el nuevo administrador con la contraseña hash
        const newAdmin = new Admin(adminData);

        // Guardar el nuevo administrador en la base de datos
        await newAdmin.save();

        console.log('Administrador de ejemplo agregado correctamente.');
    } catch (error) {
        console.error('Error al agregar el administrador:', error.message);
    } finally {
        // Cerrar la conexión a la base de datos al finalizar el proceso
        mongoose.disconnect();
    }
}

// Ejecutar la función para agregar el administrador de ejemplo
addAdmin();
