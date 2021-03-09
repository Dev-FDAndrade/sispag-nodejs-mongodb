//Carregando os Módulos
const express = require('express');
const handlebars = require('express-handlebars');
const app = express();
const PORT = 8080;
const admin = require('./routes/admin');



//Configurações
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Handlebars
app.engine('handlebars', handlebars({ defaultLayout: "main" }));
app.set('view engine', 'handlebars');

//Rotas
app.use('/admin', admin);








app.listen(PORT, () => {
    console.log('Servidor Iniciado!');
});

























