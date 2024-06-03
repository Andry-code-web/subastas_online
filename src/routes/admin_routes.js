const express = require('express');
const router = express.Router();

router.get('/adminG', (req, res) => {
    res.render('adminGeneral')
});

router.get('/adminV', (req, res) => {
    res.render('adminVendedor')
});

module.exports = router;