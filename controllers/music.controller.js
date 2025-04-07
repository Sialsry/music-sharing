const {Music} = require('../models/config');

const musicController = {
    async musicSelectAll() {
        try {
          const musics =  await Music.findAll()
          const musicList = musics.map(music => music.dataValues); 
            return {state:200, message :"전체 조회 성공",musicList}
        } catch (error) {
            return {state:400, message :"전체 조회 실패"}
            
        }
    }
}
module.exports= musicController