//Carregando os Módulos
const express = require('express');
const handlebars = require('express-handlebars');
const app = express();
const PORT = 8080;
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
mongoose.connect('mongodb://localhosyyyt/sispag', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conexão com o MongoDB realizada com sucesso!');
}).catch((err) => {
    console.log('Oops, não foi possivel se conectar ao MongoDB! ' + err);

});

//Arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

//Rotas
app.use('/', login);
app.use('/admin', admin);








app.listen(PORT, () => {
    console.log('Servidor Iniciado!');
});

























