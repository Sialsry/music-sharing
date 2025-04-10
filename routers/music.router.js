const router = require('express').Router()
const {musicController,likeController} = require('../controllers');

// 음악 하나 조회하는 API
router.get('/:id', async (req, res) => {
    try {
        const { id: musicId } = req.params;
        const { musicFind } = await musicController.musicSelectOne(musicId);

        if (musicFind) {
            let liked = null;
            if(req.user){
                const { id: userId } = req.user;
                const musicLikeResult = await likeController.likeUserMusic(musicId, userId);

                liked = musicLikeResult.likeCheckMusic.length > 0;
            }
            
            res.json({
                music: musicFind,
                liked // 좋아요 여부 true/false로 보냄
            });
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
        const { id : userId } = req.user
        const { id : musicId} = req.params;
        const result = await likeController.likeClick(musicId,userId)

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '좋아요 처리 실패' });
    }
})


module.exports=router