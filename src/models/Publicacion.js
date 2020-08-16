const { Schema, model } = require('mongoose');

const publicacionSchema = new Schema({
    url: {
        type: String,
        max: 100,
        required: true
    },
    descripcion: {
        type: String,
        max: 100,
        required: true
    },
    trabajador: {
        type: Schema.Types.ObjectId,
        ref: 'Trabajador'
    }
});

module.exports = model('Publicacion', publicacionSchema);