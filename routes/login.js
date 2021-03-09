//Carregando os Módulos
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Login');
});


//Exportar o Módulo de Rotas
module.exports = router;