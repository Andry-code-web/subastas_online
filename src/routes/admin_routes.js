const express = require('express');
const router = express.Router();

router.get('/adminG', (req, res) => {
    res.render('adminGeneral')
});

router.post('/adminG', (req, res) => {

});

router.get('/adminV', (req, res) => {
    res.render('adminVendedor')
});

router.post('/adminV', (req, res) => {

});

module.exports = router;