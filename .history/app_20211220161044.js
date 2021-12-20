/**
 * Sistema SISPAG - Node.js + MongoDB
 * @author : Fernando Andrade - www.fdandrade.com.br
 * @email : dev@fdandrade.com.br
 * @version : 1.0
 * @since : 08/03/2021
 * * */

//Carregando os Módulos
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const handlebars = require('express-handlebars');
const app = express();
const PORT = 3000;
const mongoose = require('mongoose');
const path = require('path');
const admin = require('./routes/admin');
const login = require('./routes/login');


//Configurações
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Handlebars
app.engine('handlebars', handlebars({ defaultLayout: "main" }));
app.set('view engine', 'handlebars');

//Conexão com o DB
mongoose.connect('mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conexão com o MongoDB realizada com sucesso!');
}).catch((err) => {
    console.log('Oops, não foi possivel se conectar ao MongoDB! => ' + err);

});

//Arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

//Sessões
app.use(session({
    secret: 'secsession',
    resave: true,
    saveUninitialized: true
}));

//Middleware
app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    next();
});

//Rotas
app.use('/', login);
app.use('/admin', admin);

app.listen(PORT, () => {
    console.log('Servidor Iniciado em https://localhost:' + PORT);
});

























