/**
 * Sistema SISPAG - Node.js + MongoDB
 * @author : Fernando Andrade - www.fdandrade.com.br
 * @email : dev@fdandrade.com.br
 * @version : 1.0
 * @since : 08/03/2021
 * * */

import mongoose from 'mongoose';

//Conexão com o DB
const { DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME } = process.env
mongoose.connect(`mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conexão com o MongoDB realizada com sucesso!');
}).catch((err) => {
    console.log('Oops, não foi possivel se conectar ao MongoDB! => ' + err);

});