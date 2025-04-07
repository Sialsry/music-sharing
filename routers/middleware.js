const jwt = require('jsonwebtoken');

const loginCheck = async (req,res,next) => {
    try {
        const {login_access_token} = req.cookies
        if(login_access_token){
            const userData = jwt.verify(login_access_token, process.env.JWT_SECRET_KEY)
            console.log(userData)
            if(userData){
                req.user = userData;
            }
        }
        next();
    } catch (error) {
        next();
    }
}
module.exports = loginCheck