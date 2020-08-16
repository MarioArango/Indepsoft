const { Router } = require('express');
const { registrar, ingresar, publicar } = require('../controllers/trabajadoresController');

const router = Router();

router.post('/registrar', registrar);
router.post('/ingresar', ingresar);
router.post('/publicar/:_id', publicar);

module.exports = router;