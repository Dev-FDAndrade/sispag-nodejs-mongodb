/**
 * Sistema SISPAG - Node.js + MongoDB
 * @author : Fernando Andrade - www.fdandrade.com.br
 * @email : dev@fdandrade.com.br
 * @version : 1.0
 * @since : 08/03/2021
 * * */

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

//Lista de Categorias
router.get('/catPagamentos', (req, res) => {
    catPagamento.find().then((catPagamento) => {
        res.render('admin/catPagamentos', { catpagamento: catPagamento });
    }).catch((erro) => {
        req.flash('error_msg', 'Oops, categoria não encontrada! => ' + err);
        res.render('admin/catPagamentos');
    });

});

router.get('/cadCatPagamento', (req, res) => {
    res.render('admin/cadCatPagamento');
});

//Adicionar Categoria Pagamento
router.post('/addCatPagamento', (req, res) => {
    //Validação
    var errors = [];
    if (!req.body.name || typeof req.body.name == undefined || req.body.name == null) {
        errors.push({ error: "Campo nome obrigatório!" })
    }

    if (errors.length > 0) {

        res.render('admin/cadCatPagamento', { errors: errors })

    } else {
        //Dados
        const data = {
            nome: req.body.name
        }
        //Adiciona os Dados no BD
        new catPagamento(data).save().then(() => {
            req.flash('success_msg', 'Categoria cadastrada com sucesso!');
            res.redirect('/admin/catPagamentos');
        }).catch((err) => {
            req.flash('error_msg', 'Oops, não foi possivel cadastrar a categoria! => ' + err);
        });
    }



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