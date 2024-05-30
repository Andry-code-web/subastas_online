const express = require('express');
const router = express.Router();

router.get('/adminG', (req, res) => {
    res.render('adminGeneral')
});

module.exports = router;