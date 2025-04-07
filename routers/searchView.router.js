const router = require('express').Router();
module.exports = router;

router.get('/어쩌구', (req, res) => { 
    res.render('저쩌구');
});