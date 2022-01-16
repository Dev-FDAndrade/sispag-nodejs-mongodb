const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
require("../models/Usuario");
const modelUsuario = mongoose.model('usuario');

module.exports = function (passport) {
    passport.use(new localStrategy({ usernameField: 'cpf', passwordField: 'senha' }, (cpf, senha, done) => {
        modelUsuario.findOne({ cpf: cpf.trim() }).then((usuario) => {

            if (!usuario) {
                return done(null, false, { message: "Cadastro não encontrado!" });
            }

            bcryptjs.compare(senha, usuario.senha, (error, correta) => {
                if (correta) {
                    return done(null, usuario);
                } else {
                    return done(null, false, { message: "Dados de acesso incorretos!" });
                }
            })
        })
    }));
 
    //Salvar dados do usuário na Sessão
    passport.serializeUser((usuario, done) => {
        done(null, usuario.id);
    });
    passport.deserializeUser((id, done) => {
        modelUsuario.findById(id, (error, usuario) => {
            done(error, usuario);
        });
    });
}