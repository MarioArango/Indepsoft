const { connect } = require('mongoose');

const conexion = async () => {
    try {
        const conexionDB = await connect(
            process.env.URI_DATABASE,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        );
        console.log(`Conectado a MongoDB`);
        return conexionDB;
    } catch (error) {
        console.log(`Error del servidor de la Base de datos`);
    }
}

module.exports = conexion;