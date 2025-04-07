const router = require('express').Router();
module.exports = router;

router.get('/', (req, res) => {
    const {user} =req
    res.render('myPage',{user});
});