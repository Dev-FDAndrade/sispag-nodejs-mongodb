//Módulos
const express = require('express');
const handlebars = require('handlebars');
const app = express();
const PORT = 8080;

//Configurações
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Handlebars
app.engine('handlebars', handlebars({ defaultLayout: "main" }));
app.set('view engine', 'handlebars');














app.listen(PORT, () => {
    console.log('Servidor Iniciado!');
});

























