//Carregando os Módulos
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Login');
});

router.get('/reset-password', (req, res) => {
    res.send('Reset Password');
});


//Exportar o Módulo de Rotas
module.exports = router;