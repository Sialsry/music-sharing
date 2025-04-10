const router = require('express').Router()
const {musicController,likeController} = require('../controllers');

// 음악 하나 조회하는 API
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { musicFind } = await musicController.musicSelectOne(id);

        if (musicFind) {
            res.json(musicFind); // 🎯 JSON으로 응답
        } else {
            res.status(404).json({ message: '음악을 찾을 수 없습니다.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류' });
    }
});
router.post('/:id/like', async (req,res)=> {
    try {
        const  {id : userId } = req.user
        const { id : musicId} = req.params;
        await likeController.likeClick(musicId,userId)
        res.redirect('/')
    } catch (error) {
        console.error(error);
    }
})


module.exports=router