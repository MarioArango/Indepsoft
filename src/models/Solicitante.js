const { Schema, model } = require('mongoose');

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

module.exports = model('Solicitante', solicitanteSchema);