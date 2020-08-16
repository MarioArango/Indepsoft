const Trabajador = require('../models/Trabajador');
const Publicacion = require('../models/Publicacion');

const { Types } = require('mongoose');
const { encriptar, comparar } = require('../util/bcrypt');
const token = require('../util/crearToken');
const cloudinary = require('cloudinary');
const fs = require('fs-extra');
const { isValidObjectId } = require('mongoose');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

const trabajadorController = {

    registrar: async (req, res) => {

        const { nombre, apellidoPaterno, apellidoMaterno, dni, distrito, email, password, telefono, rubro } = req.body;

        const foto = req.file.path;

        try {
            const trabEmail = await Trabajador.findOne({ email });
            if (trabEmail) {
                await fs.unlink(foto);
                return res.status(400).send({ status: 'Error', message: 'Email existente', code: 400 });
            }

            const trabDni = await Trabajador.findOne({ dni });
            if (trabDni) {
                await fs.unlink(foto);
                return res.status(400).send({ status: 'Error', message: 'Dni existente', code: 400 });
            }

            const trabajador = new Trabajador(req.body);
            const passwordEncriptado = await encriptar(trabajador.password);
            trabajador.password = passwordEncriptado;

            const { url } = await cloudinary.v2.uploader.upload(foto);
            trabajador.foto = url;
            trabajador.save();
            await fs.unlink(foto);
            res.status(200).send({ status: "Success", message: "Registrado", code: 200 });

        } catch (error) {
            res.status(400).send({ status: 'Error', message: 'Error de conexión', code: 400 });
        }
    },

    ingresar: async (req, res) => {

        const { email, password } = req.body;

        try {
            const trabajador = await Trabajador.findOne({ email });
            if (!trabajador) return res.status(400).send({ status: 'Error', message: 'Email incorrecto', code: 400 });
            
           const verf = await comparar(password, trabajador.password);
            if (!verf) return res.status(400).send({ status: 'Error', message: 'Contraseña incorrecta', code: 400 });

            const tkn = token.signToken(trabajador.tipoUsuario);

            res.status(200).header('auth-token', tkn).send({ status: "Success", message: "Bienvenido", code: 200 });

        } catch (error) {
            res.status(400).send({ status: 'Error', message: 'Error de conexión', code: 400 });
        }
    },

    publicar: async (req, res) => {

        const { _id } = req.params;
        const { descripcion } = req.body;
        const foto = req.file.path;
        try {

            if (!Types.ObjectId.isValid(_id)) {
                await fs.unlink(foto);
                return res.status(400).send({ status: 'Error', message: 'El Id no admite ese número de digitos', code: 400 });
            }

            const trabajador = await Trabajador.findById({ _id });

            if (!trabajador) {
                await fs.unlink(foto);
                return res.status(400).send({ status: 'Error', message: 'Trabajador no registrado', code: 400 });
            }

            const { url } = await cloudinary.v2.uploader.upload(foto);
            req.body.url = url;
            const publicacion = new Publicacion({ ...req.body, trabajador });
            publicacion.save();

            await trabajador.publicaciones.push(publicacion);
            trabajador.save();

            await fs.unlink(foto);
            res.status(200).send({ status: "Success", message: "Publicado", code: 200 });
            
        } catch (error) {
            res.status(400).send({ status: 'Error', message: 'Error de conexión', code: 400 });
            console.log(error);
        }
    }
};

module.exports = trabajadorController;