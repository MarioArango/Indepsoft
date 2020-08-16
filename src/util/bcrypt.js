const bcrypt = require('bcryptjs');  

const encript = {
    encriptar: async function (password) {
        try {
            const salt = await bcrypt.genSalt(10);
            const passwordEncriptado = await bcrypt.hash(password, salt);
            return passwordEncriptado;
        } catch (error) {
            console.log(`Error de encriptación`);
        }
    },
    comparar: async function (password, passwordEncriptado) {
        try {
            const verf = await bcrypt.compare(password, passwordEncriptado);
            return verf;
        } catch (error) {
            console.log(`Error de verificacion en la encriptación`);
        }
    }
}

module.exports = encript;
