const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const UsuarioSchema = new Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cpf: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        required: true
    },
    grupo: {
        type: Schema.Types.ObjectId,
        ref: 'grupo',
        require: true
    },
    status: {
        type: Number,
        required: true
    },
    created: {
        type: Date,
        default: Date.now()
    }
});

UsuarioSchema.plugin(mongoosePaginate);

mongoose.model('usuario', UsuarioSchema);

