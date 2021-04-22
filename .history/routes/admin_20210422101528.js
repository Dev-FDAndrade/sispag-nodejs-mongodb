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

//Funções
const removeEspacoDuplo = require('../funcoes/removeEspacoDuplo');

//Models
require('../models/CatPagamento');
const modelCatPagamento = mongoose.model('categoriasPagamento');
router.get('/', (req, res) => {
    res.render('admin/index');
});

//Lista de Categorias
router.get('/catPagamentos', (req, res) => {
    modelCatPagamento.find().lean().then((categoriasPagamento) => {
        res.render('admin/catPagamentos', { categoriasPagamentos: categoriasPagamento });
    }).catch((err) => {
        req.flash('error_msg', 'Oops, categoria não encontrada! => ' + err);
        res.render('admin/catPagamentos');
    });
});

//View Cadastrar Categoria
router.get('/cadCatPagamento', (req, res) => {
    res.render('admin/cadCatPagamento');
});

//Adicionar Categoria Pagamento
router.post('/addCatPagamento', (req, res) => {
    var errors = [];
    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        errors.push({ error: "Campo nome obrigatório!" })
    }
    if (errors.length > 0) {
        res.render('admin/cadCatPagamento', { errors: errors })
    } else {
        //Dados do Formulário
        const data = {
            nome: removeEspacoDuplo(req.body.nome)
        }
        //Verifica se categoria já existe
        modelCatPagamento.findOne({ nome: removeEspacoDuplo(req.body.nome) }, function (err, novaCategoria) {
            if (err) console.log(err);
            if (novaCategoria) {
                req.flash("error_msg", "Oops, Categoria de pagamento " + novaCategoria.nome + " já existe!")
                res.redirect('/admin/catPagamentos')
            } else {
                //Adiciona os Dados no BD
                new modelCatPagamento(data).save().then(() => {
                    req.flash('success_msg', 'Categoria cadastrada com sucesso!');
                    res.redirect('/admin/catPagamentos');
                }).catch((err) => {
                    req.flash('error_msg', 'Oops, não foi possivel cadastrar a categoria! => ' + err);
                });
            }
        });
    }
});

//View Pagamentos
router.get('/pagamentos', (req, res) => {
    res.send('Página de Pagamentos');
});

//Adicionar Pagamento
router.post('/addPagamentos', (req, res) => {
    res.render('admin/catPagamento');
});

//Exportar o Módulo de Rotas
module.exports = router;