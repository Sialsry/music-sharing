const {User} =require('../models/config')

const userController = {
    async signup(uid,nickname,profileImg) {
        try {
           const duplicationUser = await User.findOne({where : {uid}})
           if(duplicationUser){
            return {state : 400, message : "중복 회원가입"}
           }else{

               await User.create({uid,nickname,profileImg})
               return {state : 200, message : "회원가입 성공"}
            }
        } catch (error) {
            console.error(error);
          return {state : 500, message : "회원가입 실패"}
        }
    }
}
module.exports = userController