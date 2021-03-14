const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Modelo Tabela
const tbl_catPagamento = new Schema({
    name: {
        type: String,
        require: true
    },
    created: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model('tbl_catPagamento', tbl_catPagamento);
