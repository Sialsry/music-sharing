const detailRouter = require('./detail.router');
const mainRouter = require('./main.router');
const liveRouter = require('./live.router');
const mypageRouter = require('./mypage.router');
const searchViewRouter = require('./searchView.router');
const musicRouter = require('./music.router')
const loginCheck =require('./middleware')





module.exports = { detailRouter, 
                   mainRouter, 
                   liveRouter, 
                   mypageRouter, 
                   searchViewRouter,
                   musicRouter,
                   loginCheck };
