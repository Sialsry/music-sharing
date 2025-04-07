const {User} =require('../models/config')

const userController = {
    async signup(uid,nickName,userimage) {
        try {
           const duplicationUser = await User.findOne({where : {uid}})
           if(duplicationUser){
            return {state : 400, message : "중복 회원가입"}
           }
            await User.create({uid,nickName,userimage})
            return {state : 200, message : "회원가입 성공"}
        } catch (error) {
          return {state : 500, message : "회원가입 실패"}
        }
    }
}
module.exports = userController