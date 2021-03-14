const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Modelo Tabela
const catPagamento = new Schema({
    name: {
        type: String,
        require: true
    },
    created: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model('cataPagamento', catPagamento);
