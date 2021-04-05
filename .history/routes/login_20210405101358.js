/**
 * Sistema SISPAG - Node.js + MongoDB
 * @author : Fernando Andrade - www.fdandrade.com.br
 * @email : dev@fdandrade.com.br
 * @version : 1.0
 * @since : 08/03/2021
 * * */

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