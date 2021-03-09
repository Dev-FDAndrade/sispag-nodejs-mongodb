//Carregando os Módulos
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Home');
});

router.get('/pagamentos', (req, res) => {
    res.send('Página de Pagamentos');
});