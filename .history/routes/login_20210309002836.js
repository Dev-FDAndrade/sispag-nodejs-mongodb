//Carregando os Módulos
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Login');
});

router.get('/reset-password', (req, res) => {
    res.send('Reset Passworrd');
});


//Exportar o Módulo de Rotas
module.exports = router;