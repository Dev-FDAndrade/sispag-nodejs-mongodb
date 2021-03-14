const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Modelo Tabela
const CatPagamento = new Schema({
    name: {
        type: String,
        require: true
    },
    created: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model('catpagamento', CatPagamento);
