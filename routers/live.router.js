const router = require('express').Router();
const { getPlaylistMusic , updateLiveStatus}  = require('../controllers/live.controller');

router.get('/', (req, res) => {
    const {user} = req
    const { playlistName } = req.query;
    if (playlistName) {
      res.render('liveStreaming',{ user}); // 클라에서 playlistName 읽을 거니까 넘길 필요 없음
    } else {
      res.status(400).send('Missing playlistName');
    }
  });
router.get('/viewers', (req,res) => {
  res.render('viewers')
})
  router.get('/api/musiclist/:playlistName', getPlaylistMusic);

  router.post("/update", updateLiveStatus);

  
module.exports = router;
