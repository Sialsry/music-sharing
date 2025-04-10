const {Like} = require('../models/config');

const likeController = {
    async likeClick(music_id,user_id){
        try {
          const userIdFind = await Like.findOne({where:{music_id,user_id}})
          if(userIdFind){
            await Like.destroy({where: {user_id,music_id}})
            return {state:200, message:"좋아요 삭제"}
          }else{
            await Like.create({music_id,user_id})
            return {state:200, message:"좋아요 완료"}
          }
        } catch (error) {
            return console.error(error)
        }
    },
    async likeSelectAll(music_id){
      try {
        await Like.findAll({where:{music_id}})
      } catch (error) {
        return console.error(error)   
      }
    },
    async likeUserMusic(music_id,user_id){
      try {
        const likeCheckMusic = await Like.findAll({where:{music_id,user_id}})
        return {state:201, message: "좋아요 조회완료",likeCheckMusic}
      } catch (error) {
        return console.error(error)
      }
    }
}
module.exports = likeController