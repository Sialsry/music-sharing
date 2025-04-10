const router = require('express').Router();
const { getUserPlaylist } = require('../controllers/live.controller');

// MyPage에서 사용자 플레이리스트 렌더링
router.get('/', getUserPlaylist);  // /mypage 경로에서 사용자 정보를 포함한 플레이리스트를 렌더링


module.exports = router;