const { Schema, model } = require('mongoose');   

const contratoSchema = new Schema({
    estadoProceso: {
        type: Number,
        default: 1
    },
    calificacion: {
        type: Number,
        default: 0
    }
    
});

module.exports = model('Contrato', contratoSchema);