//Carregando os Módulos
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

//Models
require('../models/CatPagamento');
const catPagamento = mongoose.model('catpagamento');


router.get('/', (req, res) => {
    res.render('admin/index');
});

//Categorias
router.get('/catPagamentos', (req, res) => {
    res.render('admin/catPagamentos');
});

router.get('/cadCatPagamento', (req, res) => {
    res.render('admin/cadCatPagamento');
});

router.post('/addCatPagamento', (req, res) => {
    res.render('admin/cadCatPagamento');
});


//Pagamentos
router.post('/addPagamentos', (req, res) => {
    res.render('admin/catPagamento');
});

router.get('/pagamentos', (req, res) => {
    res.send('Página de Pagamentos');
});


//Exportar o Módulo de Rotas
module.exports = router;