const { Schema, model } = require('mongoose');  
const bcrypt = require('bcryptjs');   

const solicitanteSchema = new Schema({
    nombre: {
        type: String,
        max: 20,
        required: true
    },
    apellidoPaterno: {
        type: String,
        max: 20,
        required: true
    },
    apellidoMaterno: {
        type: String,
        max: 20,
        required: true
    },
    dni: {
        type: String,
        max: 8,
        required: true
    },
    email: {
        type: String,
        required: true,
        max: 50
    },
    password: {
        type: String,
        max: 100,
        required: true
    },
    foto: {
        type: String,
        max: 100,
        required: false
    },
    tipoUsuario: {
        type: Number,
        default: 1
    },
    estadoUsuario: {
        type: Boolean,
        default: 0
    },
    distrito: {
        type: String,
        max: 50,
        required: true
    }
});

solicitanteSchema.methods.encriptar = async function (password) {
    try {
        const salt = await bcrypt.genSalt(10);
        const passwordEncriptado = await bcrypt.hash(password, salt);
        return passwordEncriptado;
    } catch (error) {
        console.log(`Erro de encriptación`);
    }
}

solicitanteSchema.methods.comparar = async function (password, passwordEncriptado) {
    try {
        const verf = await bcrypt.compare(password, passwordEncriptado);
        return verf;
    } catch (error) {
        console.log(`Erro de verificacion en la encriptación`);
    }
}


module.exports = model('Solicitante', solicitanteSchema);