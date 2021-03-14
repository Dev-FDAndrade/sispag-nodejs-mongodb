//Carregando os Módulos
const express = require('express');
const handlebars = require('express-handlebars');
const app = express();
const PORT = 8080;
const path = require('path');
const admin = require('./routes/admin');
const login = require('./routes/login');



//Configurações
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Handlebars
app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//Arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

//Rotas
app.use('/', login);
app.use('/admin', admin);








app.listen(PORT, () => {
    console.log('Servidor Iniciado!');
});

























