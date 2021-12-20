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
const { route } = require('./login');

//Models
require('../models/CatPagamento');
const modelCatPagamento = mongoose.model('categoriasPagamento');
require('../models/Pagamento');
const modelPagamento = mongoose.model('pagamento');


router.get('/', (req, res) => {
    res.render('admin/index');
});

//Lista de Categorias
router.get('/catPagamentos', (req, res) => {
    modelCatPagamento.find().lean().then((listCategoriasPagamento) => {
        res.render('admin/catPagamentos', { data: listCategoriasPagamento });
    }).catch((error) => {
        req.flash('error_msg', 'Oops, categoria não encontrada! => ' + error);
        res.render('admin/catPagamentos');
    });
});

//Visualizar Categoria
router.get('/viewCatPagamento/:id', (req, res) => {
    modelCatPagamento.findOne({ _id: req.params.id }).lean().then((infoCatPagamento) => {
        res.render('admin/viewCatPagamento', { data: infoCatPagamento });
    }).catch((error) => {
        req.flash('error_msg', 'Oops, categoria não encontrada! => ' + error);
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
    }else if(req.body.nome.length < 3){
 errors.push({ error: "Tamanho mínimo de 3 caracteres." })
}
    if (errors.length > 0) {
        res.render('admin/cadCatPagamento', { errors: errors })
    } else {
        //Dados do Formulário
        const data = {
            nome: removeEspacoDuplo(req.body.nome)
        }
        //Verifica se categoria já existe
        modelCatPagamento.findOne({ nome: removeEspacoDuplo(req.body.nome) }, function (error, novaCategoria) {
            if (error) console.log(error);
            if (novaCategoria) {
                req.flash("error_msg", "Oops, Categoria de pagamento " + novaCategoria.nome + " já existe!")
                res.redirect('/admin/catPagamentos')
            } else {
                //Adiciona os Dados no BD
                new modelCatPagamento(data).save().then(() => {
                    req.flash('success_msg', 'Categoria cadastrada com sucesso!');
                    res.redirect('/admin/catPagamentos');
                }).catch((error) => {
                    req.flash('error_msg', 'Oops, não foi possivel cadastrar a categoria! => ' + error);
                });
            }
        });
    }
});

//Editar Categoria Pagamento
router.get('/editCatPagamento/:id', (req, res) => {
    modelCatPagamento.findOne({ _id: req.params.id }).lean().then((infoCategoria) => {
        res.render('admin/editCatPagamento', { data: infoCategoria })
    }).catch((error) => {
        req.flash('error_msg', 'Oops, categoria não encontrada! => ' + error);
        res.redirect('/admin/catPagamentos');
    });
});

//Update Categoria Pagamento
router.post('/updateCatPagamento', (req, res) => {
    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        req.flash('error_msg', 'Oops, nome da categortia é obrigatório!');
        res.redirect('/admin/editCatPagamento/' + req.body.id);
    } else {
        modelCatPagamento.findOne({ _id: req.body.id }).then((catPagamento) => {
            catPagamento.nome = req.body.nome
            catPagamento.save().then(() => {
                req.flash('success_msg', 'Categoria atualizada com sucesso!');
                res.redirect('/admin/catPagamentos');
            }).catch((error) => {
                req.flash('error_msg', 'Oops, não foi possivel atualizar a categoria! => ' + error);
                res.redirect('/admin/catPagamentos');
            });
        }).catch((error) => {
            req.flash('error_msg', 'Oops, não foi possivel atualizar, categoria não encontrada! => ' + error);
            res.redirect('/admin/catPagamentos');
        });
    }
});

//Excluir Categoria Pagamento
router.get('/deleteCatPagamento/:id', (req, res) => {
    modelCatPagamento.deleteOne({ _id: req.params.id }).then(() => {
        req.flash('success_msg', 'Categoria excluida com sucesso!');
        res.redirect('/admin/catPagamentos');
    }).catch((error) => {
        req.flash('error_msg', 'Oops, não foi possivel excluir a categoria! => ' + error);
        res.redirect('/admin/catPagamentos');
    });
});

//View Pagamentos
router.get('/pagamentos', (req, res) => {
    modelPagamento.find().populate("categoria").lean().then((pagamentos) => {
        res.render("admin/pagamentos", { data: pagamentos });
    }).catch((error) => {
        req.flash('error_msg', 'Oops, não foi possivel listar os pagamentos! => ' + error);
        res.redirect('/admin/pagamentos');
    });

});

//View Cadastro Pagamento
router.get('/cadPagamento', (req, res) => {
    modelCatPagamento.find().lean().then((categoriasPagamento) => {
        res.render("admin/cadPagamento", { categorias: categoriasPagamento });

    }).catch((error) => {
        req.flash('error_msg', 'Oops, não foi possivel carregar o Formulário! => ' + error);
        res.redirect('/admin/pagamentos');
    });

});

//Adicionar Pagamento no BD
router.post('/addPagamento', (req, res) => {
    var errors = [];
    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        errors.push({ error: "Necessário preencher o campo nome" });
    }
    if (!req.body.valor || typeof req.body.valor == undefined || req.body.valor == null) {
        errors.push({ error: "Necessário preencher o campo valor" });
    }
    if (!req.body.categoria || typeof req.body.categoria == undefined || req.body.categoria == null) {
        errors.push({ error: "Necessário selecionar uma categoria!" });;
    }

    if (errors.length > 0) {
        res.render("admin/cadPagamento", { errors: errors });
    } else {
        const addPagamento = {
            nome: req.body.nome,
            valor: req.body.valor,
            categoria: req.body.categoria,
        }
        console.log(addPagamento);
        new modelPagamento(addPagamento).save().then(() => {
            req.flash('success_msg', 'Pagamento cadastrado com sucesso!');
            res.redirect('/admin/pagamentos');
        }).catch((error) => {
            req.flash('error_msg', 'Oops, não foi possivel cadastrar! => ' + error);
            res.redirect('/admin/cadPagamento');
        });
    }

});


//Visualizar Pagamento
router.get('/viewPagamento/:id', (req, res) => {
    modelPagamento.findOne({ _id: req.params.id }).populate("categoria").lean().then((infoPagamento) => {
        res.render('admin/viewPagamento', { data: infoPagamento });
        console.log(infoPagamento);
    }).catch((error) => {
        req.flash('error_msg', 'Oops, pagamento não encontrado! => ' + error);
        res.render('admin/pagamentos');
    });
});


//Editar Pagamento
router.get('/editPagamento/:id', (req, res) => {
    modelPagamento.findOne({ _id: req.params.id }).populate("categoria").lean().then((infoPagamento) => {
        modelCatPagamento.find().lean().then((catpagamentos) => {
            res.render('admin/editPagamento', { data: infoPagamento, categorias: catpagamentos });
            console.log(infoPagamento);
        }).catch((error) => {
            req.flash('error_msg', 'Oops, não foi possivel carregar as categorias! => ' + error);
            res.render('admin/pagamentos');
        });

    }).catch((error) => {
        req.flash('error_msg', 'Oops, pagamento não encontrado! => ' + error);
        res.redirect('/admin/pagamentos');
    });
});

//Update Categoria Pagamento
router.post('/updateCatPagamento', (req, res) => {
    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        req.flash('error_msg', 'Oops, nome da categortia é obrigatório!');
        res.redirect('/admin/editCatPagamento/' + req.body.id);
    } else {
        modelCatPagamento.findOne({ _id: req.body.id }).then((catPagamento) => {
            catPagamento.nome = req.body.nome
            catPagamento.save().then(() => {
                req.flash('success_msg', 'Categoria atualizada com sucesso!');
                res.redirect('/admin/catPagamentos');
            }).catch((error) => {
                req.flash('error_msg', 'Oops, não foi possivel atualizar a categoria! => ' + error);
                res.redirect('/admin/catPagamentos');
            });
        }).catch((error) => {
            req.flash('error_msg', 'Oops, não foi possivel atualizar, categoria não encontrada! => ' + error);
            res.redirect('/admin/catPagamentos');
        });
    }
});

//Excluir Pagamento
router.get('/deletePagamento/:id', (req, res) => {
    modelPagamento.deleteOne({ _id: req.params.id }).then(() => {
        req.flash('success_msg', 'Pagamento excluido com sucesso!');
        res.redirect('/admin/pagamentos');
    }).catch((error) => {
        req.flash('error_msg', 'Oops, não foi possivel excluir o pagamento! => ' + error);
        res.redirect('/admin/pagamentos');
    });
});

//Exportar o Módulo de Rotas
module.exports = router;

