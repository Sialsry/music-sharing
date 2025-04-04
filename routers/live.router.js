const router = require('express').Router();

router.get('/', (req,res)=>{
    res.render('liveStreaming')
})

module.exports = router