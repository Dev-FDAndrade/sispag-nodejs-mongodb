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