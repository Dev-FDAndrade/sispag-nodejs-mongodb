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

//Criptografia
const bcryptjs = require('bcryptjs');
import { truncate } from 'fs';

//Funções
const removeEspacoDuplo = require('../funcoes/removeEspacoDuplo');
const { route } = require('./login');

//Models
require('../models/CatPagamento');
const modelCatPagamento = mongoose.model('categoriasPagamento');
require('../models/Pagamento');
const modelPagamento = mongoose.model('pagamento');
require('../models/Usuario');
const modelUsuario = mongoose.model('usuario');
require('../models/Grupo');
const modelGrupo = mongoose.model('grupo');
const passport = require('passport');
const { isLogged } = require('../helpers/isLogged_helper');

router.get('/', isLogged, (req, res) => {
    res.render('admin/index');
});

router.get('/login', (req, res) => {
    res.render('admin/login');
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Deslogado com sucesso!');
    res.redirect('/admin/login');
});

router.post('/login', (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/admin/",
        failureRedirect: "/admin/login",
        failureFlash: true
    })(req, res, next);
});

//Lista de Categorias
router.get('/catPagamentos', isLogged, (req, res) => {
    modelCatPagamento.find().lean().then((listCategoriasPagamento) => {
        res.render('admin/catPagamentos', { data: listCategoriasPagamento });
    }).catch((error) => {
        req.flash('error_msg', 'Oops, categoria não encontrada! => ' + error);
        res.render('admin/catPagamentos');
    });
});

//Visualizar Categoria
router.get('/viewCatPagamento/:id', isLogged, (req, res) => {
    modelCatPagamento.findOne({ _id: req.params.id }).lean().then((infoCatPagamento) => {
        res.render('admin/viewCatPagamento', { data: infoCatPagamento });
    }).catch((error) => {
        req.flash('error_msg', 'Oops, categoria não encontrada! => ' + error);
        res.render('admin/catPagamentos');
    });
});

//View Cadastrar Categoria
router.get('/cadCatPagamento', isLogged, (req, res) => {
    res.render('admin/cadCatPagamento');
});

//Adicionar Categoria Pagamento
router.post('/addCatPagamento', isLogged, (req, res) => {
    var errors = [];
    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        errors.push({ error: "Campo nome obrigatório!" })
    } else if (req.body.nome.length < 3) {
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
router.get('/editCatPagamento/:id', isLogged, (req, res) => {
    modelCatPagamento.findOne({ _id: req.params.id }).lean().then((infoCategoria) => {
        res.render('admin/editCatPagamento', { data: infoCategoria })
    }).catch((error) => {
        req.flash('error_msg', 'Oops, categoria não encontrada! => ' + error);
        res.redirect('/admin/catPagamentos');
    });
});

//Update Categoria Pagamento
router.post('/updateCatPagamento', isLogged, (req, res) => {
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
router.get('/deleteCatPagamento/:id', isLogged, (req, res) => {
    modelCatPagamento.deleteOne({ _id: req.params.id }).then(() => {
        req.flash('success_msg', 'Categoria excluida com sucesso!');
        res.redirect('/admin/catPagamentos');
    }).catch((error) => {
        req.flash('error_msg', 'Oops, não foi possivel excluir a categoria! => ' + error);
        res.redirect('/admin/catPagamentos');
    });
});

//View Pagamentos
router.get('/pagamentos', isLogged, (req, res) => {
    modelPagamento.find().populate("categoria").lean().then((pagamentos) => {
        res.render("admin/pagamentos", { data: pagamentos });
    }).catch((error) => {
        req.flash('error_msg', 'Oops, não foi possivel listar os pagamentos! => ' + error);
        res.redirect('/admin/pagamentos');
    });

});

//View Cadastro Pagamento
router.get('/cadPagamento', isLogged, (req, res) => {
    modelCatPagamento.find().lean().then((categoriasPagamento) => {
        res.render("admin/cadPagamento", { categorias: categoriasPagamento });

    }).catch((error) => {
        req.flash('error_msg', 'Oops, não foi possivel carregar o Formulário! => ' + error);
        res.redirect('/admin/pagamentos');
    });

});

//Adicionar Pagamento no BD
router.post('/addPagamento', isLogged, (req, res) => {
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
router.get('/viewPagamento/:id', isLogged, (req, res) => {
    modelPagamento.findOne({ _id: req.params.id }).populate("categoria").lean().then((infoPagamento) => {
        res.render('admin/viewPagamento', { data: infoPagamento });
    }).catch((error) => {
        req.flash('error_msg', 'Oops, pagamento não encontrado! => ' + error);
        res.render('admin/pagamentos');
    });
});


//Editar Pagamento
router.get('/editPagamento/:id', isLogged, (req, res) => {
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
router.post('/updateCatPagamento', isLogged, (req, res) => {
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
router.get('/deletePagamento/:id', isLogged, (req, res) => {
    modelPagamento.deleteOne({ _id: req.params.id }).then(() => {
        req.flash('success_msg', 'Pagamento excluido com sucesso!');
        res.redirect('/admin/pagamentos');
    }).catch((error) => {
        req.flash('error_msg', 'Oops, não foi possivel excluir o pagamento! => ' + error);
        res.redirect('/admin/pagamentos');
    });
});

//Update Pagamento
router.post('/updatePagamento', isLogged, (req, res) => {
    var error = false;
    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        req.flash('error_msg', 'Oops, informe  o nome do pagamento!');
        error = true;
    }
    if (!req.body.valor || typeof req.body.valor == undefined || req.body.valor == null) {
        req.flash('error_msg', 'Oops, informe  o valor do pagamento!');
        error = true;
    }
    if (!req.body.categoria || typeof req.body.categoria == undefined || req.body.categoria == null) {
        req.flash('error_msg', 'Oops, informe a categoria do pagamento!');
        error = true;
    }
    if (error == true) {
        res.redirect('editPagamento/' + req.body.id);
    } else {
        modelPagamento.findOne({ _id: req.body.id }).then((Pagamento) => {
            Pagamento.nome = req.body.nome;
            Pagamento.valor = req.body.valor;
            Pagamento.categoria = req.body.categoria;

            Pagamento.save().then(() => {
                req.flash('success_msg', 'Pagamento atualizado com sucesso!');
                res.redirect('/admin/pagamentos');
            }).catch((error) => {
                req.flash('error_msg', 'Oops, não foi possivel atualizar o pagamento! => ' + error);
                res.redirect('/admin/pagamentos');
            });
        }).catch((error) => {
            req.flash('error_msg', 'Oops, não foi possivel atualizar, pagamento não encontrada! => ' + error);
            res.redirect('/admin/pagamentos');
        });
    }
});

//Lista Usuários
router.get('/usuarios', isLogged, (req, res) => {
    const { page = 1 } = req.query;
    var options = {
        sort: { date: -1 },
        populate: 'grupo',
        lean: true,
        page: page,
        limit: 2
    };
    modelUsuario.paginate({}, options).then((usuarios) => {
        res.render("admin/usuarios", { data: usuarios });
    }).catch((error) => {
        req.flash('error_msg', 'Oops, não foi possivel listar os usuários! => ' + error);
        res.redirect('/admin/usuarios');
    });
});


//View Cadastrar Usuário
router.get('/cadUsuario', isLogged, (req, res) => {
    modelGrupo.find().lean().then((grupos) => {
        res.render("admin/cadUsuario", { data: grupos });
    }).catch((error) => {
        req.flash('error_msg', 'Oops, não foi possivel carregar o Formulário! => ' + error);
        res.redirect('/admin/usuarios');
    });

});

//Adicionar Usuário
router.post('/addUsuario', isLogged, (req, res) => {
    var errors = [];
    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        errors.push({ error: "Campo Nome é obrigatório!" })
    } else if (req.body.nome.length < 3) {
        errors.push({ error: "Tamanho mínimo de 3 caracteres." })
    }

    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        errors.push({ error: "Campo Email é obrigatório!" })
    } else if (req.body.email.length < 10) {
        errors.push({ error: "Tamanho mínimo de 10 caracteres." })
    }

    if (!req.body.cpf || typeof req.body.cpf == undefined || req.body.cpf == null) {
        errors.push({ error: "Campo CPF é obrigatório!" })
    } else if (req.body.cpf.length < 11) {
        errors.push({ error: "Tamanho mínimo de 11 caracteres." })
    }

    if (!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null) {
        errors.push({ error: "Campo Senha é obrigatório!" })
    } else if (req.body.senha.length < 6) {
        errors.push({ error: "Tamanho mínimo de 6 caracteres." })
    }

    if (!req.body.csenha || typeof req.body.csenha == undefined || req.body.csenha == null) {
        errors.push({ error: "Campo Confirmar Senha é obrigatório!" })
    } else if (req.body.senha.length < 6) {
        errors.push({ error: "Tamanho mínimo de 6 caracteres." })
    }

    if (req.body.senha != req.body.csenha) {
        errors.push({ error: "O Campo Senha e Confirmação Senha não são diferentes!" })
    }

    if (!req.body.grupo || typeof req.body.grupo == undefined || req.body.grupo == null) {
        errors.push({ error: "Campo Grupo obrigatório!" })
    }


    if (errors.length > 0) {
        res.render('admin/cadUsuario', { errors: errors })
    } else {
        //Dados do Formulário
        const data = {
            nome: removeEspacoDuplo(req.body.nome),
            email: req.body.email.trim(),
            cpf: req.body.cpf.trim(),
            grupo: req.body.grupo,
            status: req.body.status
        }

        bcryptjs.genSalt(10, (error, salt) => {
            bcryptjs.hash(req.body.senha.trim(), salt, (error, hash) => {
                if (error) {
                    req.flash("error_msg", "Oops, não foi possivel cadastrar!");
                    res.redirect('/admin/cadUsuario');
                } else {
                    data.senha = hash;
                    //Verifica se usuario já existe
                    modelUsuario.findOne({ cpf: req.body.cpf }, function (error, usuarioExiste) {
                        if (error) console.log(error);
                        if (usuarioExiste) {
                            req.flash("error_msg", "Oops, Já existe o usuário " + usuarioExiste.nome + " cadastrado com o CPF:" + usuarioExiste.cpf)
                            res.redirect('/admin/usuarios')
                        } else {
                            //Adiciona os Dados no BD
                            new modelUsuario(data).save().then(() => {
                                req.flash('success_msg', 'Usuario cadastrado com sucesso!');
                                res.redirect('/admin/usuarios');
                            }).catch((error) => {
                                req.flash('error_msg', 'Oops, não foi possivel cadastrar o usuário! => ' + error);
                            });
                        }
                    });
                }
            });
        });
    }
});


//Visualizar Usuário
router.get('/viewUsuario/:id', isLogged, (req, res) => {
    modelUsuario.findOne({ _id: req.params.id }).populate("grupo").lean().then((infoUsuario) => {
        res.render('admin/viewUsuario', { data: infoUsuario });
    }).catch((error) => {
        req.flash('error_msg', 'Oops, usuário não encontrado! => ' + error);
        res.render('admin/usuarios');
    });
});

//Editar Usuário
router.get('/editUsuario/:id', isLogged, (req, res) => {
    modelUsuario.findOne({ _id: req.params.id }).populate("grupo").lean().then((infoUsuario) => {
        modelGrupo.find().lean().then((grupos) => {
            res.render('admin/editUsuario', { data: infoUsuario, grupos: grupos });
        }).catch((error) => {
            req.flash('error_msg', 'Oops, não foi possivel carregar as informações! => ' + error);
            res.render('admin/usuarios');
        });
    }).catch((error) => {
        req.flash('error_msg', 'Oops, pagamento não encontrado! => ' + error);
        res.redirect('/admin/pagamentos');
    });
});

//Update Usuário
router.post('/updateUsuario', isLogged, (req, res) => {
    var data_user = req.body;
    var errors = [];
    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        errors.push({ error: 'Oops, informe o nome!' });
    }
    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        errors.push({ error: 'Oops, informe o email!' });
    }
    if (!req.body.cpf || typeof req.body.cpf == undefined || req.body.cpf == null) {
        errors.push({ error: 'Oops, informe o CPF!' });
    }
    if (errors.length > 0) {
        req.flash('errors_msg', errors);
        res.redirect('editUsuario/' + req.body.id);
    } else {
        modelUsuario.findOne({ _id: req.body.id }).then((Usuario) => {
            Usuario.nome = req.body.nome;
            Usuario.email = req.body.email;
            Usuario.cpf = req.body.cpf;
            Usuario.grupo = req.body.grupo;
            Usuario.status = req.body.status;

            if (req.body.senha != '') {
                Usuario.senha = req.body.senha;
            }

            Usuario.save().then(() => {
                req.flash('success_msg', 'Usuário atualizado com sucesso!');
                res.redirect('/admin/usuarios');
            }).catch((error) => {
                req.flash('error_msg', 'Oops, não foi possivel atualizar o usuário! => ' + error);
                res.redirect('/admin/usuarios');
            });
        }).catch((error) => {
            req.flash('error_msg', 'Oops, não foi possivel atualizar, usuário não encontrado! => ' + error);
            res.redirect('/admin/usuarios');
        });
    }
});

//Exportar o Módulo de Rotas
module.exports = router;