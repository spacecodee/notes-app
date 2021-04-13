const express = require('express');
const router = express.Router();

router.get('/', ((req, res) => {
    res.render('index');
}));

router.get('/about', (req, res, next) => {
    res.render('about');
});

module.exports = router;
