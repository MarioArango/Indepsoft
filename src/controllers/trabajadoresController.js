const Trabajador = require('../models/Trabajador');
const Publicacion = require('../models/Publicacion');

const token = require('../util/crearToken');
const cloudinary = require('cloudinary');
const fs = require('fs-extra');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

const trabajadorController = {};

trabajadorController.registrar = async (req, res) => {

    try {
        const trabEmail = await Trabajador.findOne({ email: req.body.email });
        if (trabEmail) return res.status(400).send({ status: 'Error', message: 'Email existente', code: 400 });

        const trabDni = await Trabajador.findOne({ dni: req.body.dni});
        if (trabDni) return res.status(400).send({ status: 'Error', message: 'Dni existente', code: 400 }); 

        const trabajador = new Trabajador(req.body);
        const passwordEncriptado = await trabajador.encriptar(trabajador.password);
        trabajador.password = passwordEncriptado;

        const { url } = await cloudinary.v2.uploader.upload(req.file.path);
        trabajador.foto = await url;
        trabajador.save();
        await fs.unlink(req.file.path);
        res.status(200).send({ status: "Success", message: "Registrado", code: 200 });

    } catch (error) {
        res.status(400).send({ status: 'Error', message: 'Error de conexión', code: 400 });
    }
};

trabajadorController.ingresar = async (req, res) => {
    try {
        const trabEmail = Trabajador.findOne({email: req.body.email});
        if (!trabEmail) return res.status(400).send({ status: 'Error', message: 'Email incorrecto', code: 400 });
        
        const trabajador = new Trabajador();
        const verf =  trabajador.comparar(req.body.password, trabajador.password);
        if (!verf) return res.status(400).send({ status: 'Error', message: 'Contraseña incorrecta', code: 400 });

        const tkn = token.signToken(trabajador.tipoUsuario);

        res.status(200).header('auth-token', tkn).send({ status: "Success", message: "Bienvenido", code: 200 });

    } catch (error) {
        res.status(400).send({ status: 'Error', message: 'Error de conexión', code: 400 });
    }
};

trabajadorController.publicar = async (req, res) => {
    try {
        const trabajador = Trabajador.findById({_id: req.params.id});
        if (!trabajador) return res.status(400).send({ status: 'Error', message: 'Trabajador no registrado', code: 400 });

        const { url } = await cloudinary.v2.uploader.upload(req.file.path);
        req.body.url = url;
        const publicacion = new Publicacion({...req.body, trabajador});
        publicacion.save();
        await fs.unlink(req.file.path);
        res.status(200).send({ status: "Success", message: "Publicado", code: 200 });
    } catch (error) {
        res.status(400).send({ status: 'Error', message: 'Error de conexión', code: 400 }); 
    }
};

module.exports = trabajadorController;