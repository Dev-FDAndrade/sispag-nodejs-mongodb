//Carregando os Módulos
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

//Models
require('../models/CatPagamento');
const catPagamento = mongoose.model('catPagamento');

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
    //Dados
    const data = {
        nome: req.body.name
    }
    //Adiciona no BD
    new catPagamento(data).save().then(() => {
        console.log('Categoria cadastrada com sucesso!');
    }).catch((err) => {
        console.log('Oops, não foi possivel cadastrar a categoria! => ' + err);
    });

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