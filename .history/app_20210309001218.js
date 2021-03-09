//Módulos
const express = require('express');
const handlebars = require('handlebars');
const app = express();
const PORT = 8080;

//Configurações
app.use(express.urlencoded({ extended: true }));
app.use(express.json());













app.listen(PORT, () => {
    console.log('Servidor Iniciado!');
});

























