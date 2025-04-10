const searchViewRouter = require('./searchView.router');
const liveRouter = require('./live.router');
const mypageRouter = require('./mypage.router');
const loginCheck =require('./middleware')
const mainRouter = require('./main.router');


module.exports = {searchViewRouter,
                 liveRouter,
                mypageRouter,
                mainRouter,
                loginCheck,
            };