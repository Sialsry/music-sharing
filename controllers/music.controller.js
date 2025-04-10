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
    },
    async musicSelectOne(id) {
        try {
            const music = await Music.findOne({where : {id}})
            return {state:200, message : "낱개 조회성공", musicFind: music}
        } catch (error) {
            return {state:400, message : "낱개 조회실패"}
        }
    }
}
module.exports= musicController