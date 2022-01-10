/**
 * Sistema SISPAG - Node.js + MongoDB
 * @author : Fernando Andrade - www.fdandrade.com.br
 * @email : dev@fdandrade.com.br
 * @version : 1.0
 * @since : 08/03/2021
 * * */

//Carregando os Módulos
import './setup/db';

const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const handlebars = require('express-handlebars');
const {select} = require('./helpers/handlebar_helper');
const app = express();
const PORT = 3000;
const path = require('path');
const admin = require('./routes/admin');
const login = require('./routes/login');
const passport = require('passport')
require("./config/auth")(passport)


//Configurações
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Handlebars
var hbs = handlebars.create({helpers: require('./helpers/handlebar_helper'), defaultLayout: 'main'});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

//Arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

//Sessões
app.use(session({
    secret: 'secsession',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


//Middleware
app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.errors_msg = req.flash("errors_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    next();
});

//Rotas
app.use('/', login);
app.use('/admin', admin);

app.listen(PORT, () => {
    console.log('Servidor Iniciado em https://localhost:' + PORT);
});