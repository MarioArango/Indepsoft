const { Schema, model } = require('mongoose'); 

const trabajadorSchema = new Schema({
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
    rubro: {
        type: String,
        max: 50,
        required: true
    },
    foto: { 
        type: String
    },
    tipoUsuario: {
        type: Number,
        default: 1
    },
    estadoUsuario: {
        type: Boolean,
        default: 1
    },
    distrito: {
        type: String,
        max: 50,
        required: true
    },
    telefono: {
        type: Number,
        required: true
    },
    calificacion: {
        type: Number,
        default: 0,
    },
    publicaciones: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Publicacion'
        }
    ]

});

module.exports = model('Trabajador', trabajadorSchema);