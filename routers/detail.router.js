const router = require('express').Router();
const {musicController} =require('../controllers');


router.get('/', async (req, res) => {
    const {user} = req
    const {musicList} = await musicController.musicSelectAll()
    console.log(user);
    res.render('listDetail',{user,musicList});
});
module.exports = router;
