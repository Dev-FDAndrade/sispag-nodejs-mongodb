//Carregando os Módulos
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('admin/index');
});

router.get('/cat-pagamentos', (req, res) => {
    res.render('admin/catPagamento');
});

router.get('/cad-cat-pagamentos', (req, res) => {
    res.render('admin/cadCatPagamento');
});


router.post('/add-pagamentos', (req, res) => {
    res.render('admin/catPagamento');
});

router.get('/pagamentos', (req, res) => {
    res.send('Página de Pagamentos');
});


//Exportar o Módulo de Rotas
module.exports = router;