const { Router } = require('express');
const trabajadorController = require('../controllers/trabajadoresController');

const route = Router();

route.post('/registrar', trabajadorController.registrar);
route.post('/ingresar', trabajadorController.ingresar);
route.post('/publicar', trabajadorController.publicar);

module.exports = route;