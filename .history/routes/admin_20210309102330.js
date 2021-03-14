//Carregando os Módulos
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('admin/index', { layout: false });
});

router.get('/pagamentos', (req, res) => {
    res.send('Página de Pagamentos');
});


//Exportar o Módulo de Rotas
module.exports = router;