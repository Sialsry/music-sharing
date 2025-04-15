const router = require('express').Router();
const  PostController  = require('../controllers/post.controller');
const 

router.get('/', async (req, res) => {
    const searchQuery = req.query.index || '';
    const results = await PostController.selectAll(searchQuery); 
    console.log("검색 결과:", results); // ✅ 이거 추가
    res.render('searchResult', { results }); 
});

module.exports = router;