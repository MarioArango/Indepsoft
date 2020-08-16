if(process.env.NODE_ENV === 'development'){
    require('dotenv').config();
    var morgan = require('morgan');
}

const express = require('express');
const multer = require("multer");
const { v4 } = require("uuid");
const path = require("path");
const cors = require('cors');
const conexion = require('./database');
const trabajadoresRoutes = require('./routes/trabajadores.routes');
const solicitantesRoutes = require('./routes/solicitantes.routes');   

const app = express();

const storage = multer.diskStorage({
    destination: path.join(__dirname, "public/uploads"),
    filename: (req, file, cb) => {
        cb(null, v4() + path.extname(file.originalname).toLocaleLowerCase());
    },
});

//CORS
app.use(cors({ exposedHeaders: ["auth-token"] }));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method"
    );
    res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS,PUT,DELETE");
    res.header("Allow", "GET,POST,OPTIONS,PUT,DELETE");
    next();
});

//MIDDLEWARE
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(
    multer({
        storage,
        limits: { fileSize: 2000000 },
        dest: path.join(__dirname, "public/uploads"),
        fileFilter: (req, file, cb) => {
            const filetypes = /jpeg|png|jpg/;
            const mimetype = filetypes.test(file.mimetype);
            const extname = filetypes.test(path.extname(file.originalname));
            if (mimetype && extname) {
                return cb(null, true);
            }
            cb("Error, el archivo deber ser una imagen jpeg, png o jpg");
        },
    }).single("image")
);

//SETTINGS
app.set('port', process.env.PORT || 4000);

//ROUTES
//app.use((req, res) => res.status(404).send('Page not found'));
app.use('/api/trabajador', trabajadoresRoutes);
app.use('/api/solicitante', solicitantesRoutes);

//INIT
const init = async () => {
    try {
        await app.listen(app.get('port'));
        console.log(`Servidor en el puerto ${app.get('port')}`);
        await conexion();
    } catch (error) {
        console.log(`No se puedo conectar al servidor`);
    }
}

init();