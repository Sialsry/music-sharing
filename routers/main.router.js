const router = require('express').Router();
const axios = require('axios');
const jwt = require('jsonwebtoken');
const {userController,musicController, liveController} = require('../controllers')


router.get('/',async (req,res)=> {
    const broadcasters = req.app.locals.broadcasters || {};
    const liveIds = Object.keys(broadcasters); 
        
    const {user} = req
    console.log("메인페이지 유저:", user); 
    const {musicList} = await musicController.musicSelectAll()
    const livePlaylists = await liveController.getLiveStatus();
    console.log('라이브 상태:', livePlaylists);
    res.render('main',{user,musicList, livePlaylists, liveIds});
});
// 로그인
router.get("/login", (req,res) => {
    const kakaoAuth = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URL}`
    res.redirect(kakaoAuth);
})
// 로그아웃
router.get('/logout', (req,res)=> {
    res.clearCookie("login_access_token");
    res.redirect('/');
})

router.get('/kakao/callback', async (req,res)=> {
    const {code} = req.query;

    const tokenUrl = `https://kauth.kakao.com/oauth/token`

    const data = new URLSearchParams({
        grant_type : 'authorization_code',
        client_id : process.env.KAKAO_CLIENT_ID,
        redirect_uri : process.env.REDIRECT_URL,
        code,
        client_secret : process.env.KAKAO_CLIENT_SECRET_KEY
    })
    const response = await axios.post(tokenUrl, data, {
        headers : {
            'Content-Type' : 'application/x-www-form-urlencoded'
        }
    })
    

    const { access_token } = response.data;

    // 유저 정보 조회

    const {data : userData} = await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers : {
            Authorization: `Bearer ${access_token}`
        }   
    })
    // 4000589952 고유 식별자
    const {id, properties} = userData;

    userController.signup(id,properties.nickname,properties.profile_image)

    const token = jwt.sign({id,properties}, process.env.JWT_SECRET_KEY, { expiresIn : "1h"} );

    res.cookie("login_access_token", token, {httpOnly : true, maxAge : 60 * 60 * 60 * 1000});
    res.redirect('/');
})

router.post("/updateLiveStatus", liveController.updateLiveStatus);

module.exports = router
