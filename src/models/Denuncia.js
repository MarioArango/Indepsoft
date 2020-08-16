const { Schema, model } = require('mongoose');

const DeunuciaSchema = new Schema({
    url: {
        type: String,
        max: 100,
        required: true
    },
    descripcion: {
        type: String,
        max: 100,
        required: true
    }
});

module.exports = model('Denuncia', DeunuciaSchema);