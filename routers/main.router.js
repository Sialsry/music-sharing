const router = require('express').Router();
const axios = require('axios');
const jwt = require('jsonwebtoken');
const {userController,musicController} = require('../controllers/index')



router.get('/',async (req,res)=> {
    const {user} = req
    const {musicList} = await musicController.musicSelectAll()
    res.render('main',{user,musicList});
})
router.get("/login", (req,res) => {
    const kakaoAuth = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URL}`
    res.redirect(kakaoAuth);
})
router.get('/logout', (req,res)=> {
    res.clearCookie("login_access_token");
    res.redirect('/');
})

router.get('/kakao/callback', async (req,res)=> {
    const {code} = req.query;
    // 엑세스 토큰 요청 왜?
    // 카카오 api를 호출할때 사용해야한다. 엑세스토큰이 즉 api를 호출할수 있는 권한 허가
    // 동의 항목에 추가한 내용이 있는지도 확인.
    
    // params 변수 정해진 내용을 전달.
    const tokenUrl = `https://kauth.kakao.com/oauth/token`
    // 쿼리를 많이 사용하니까 
    // 내장 클래스를 사용해서 쿼리 문자열 생성
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
    // jwt
    const {id, properties} = userData;

    userController.signup(id,properties.nickname,properties.profile_image)

    const token = jwt.sign({id,properties}, process.env.JWT_SECRET_KEY, { expiresIn : "1h"} );

    res.cookie("login_access_token", token, {httpOnly : true, maxAge : 60 * 60 * 60 * 1000});
    // client_id
    // redirect_uri
    // code
    // client_secret
    res.redirect('/');
})

module.exports = router