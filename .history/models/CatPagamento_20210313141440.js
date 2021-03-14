const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Modelo Tabela
const cat1Pagamento = new Schema({
    name: {
        type: String,
        require: true
    },
    created: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model('catPagamento', cat1Pagamento);
