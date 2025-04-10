const Sequelize = require('sequelize');
const User = require('./user')
const Like = require('./like')
const Live = require('./live')
const Music = require('./music')
const Playlist = require('./playlist')

const sequelize = new Sequelize(
  process.env.DATABASE_NAME, // 사용할 데이터 베이스 이름
  process.env.DATABASE_USER, // 사용할 계정(유저) 이름
  process.env.DATABASE_PASSWORD, // 사용할 계정의 비밀번호 
  { // 사용할 데이터베이스의 속성
    host : process.env.DATABASE_HOST,
    dialect : "mysql",
    port : process.env.DATABASE_PORT
  }
);

const users = User.init(sequelize);
const likes = Like.init(sequelize);
const lives = Live.init(sequelize);
const musics = Music.init(sequelize);
const playlists = Playlist.init(sequelize);

const db = {
  User: users,
  Like: likes,
  Live: lives,
  Music: musics,
  Playlist: playlists,
  sequelize
}

users.associate(db);
likes.associate(db);
lives.associate(db);
musics.associate(db);
playlists.associate(db);

sequelize.sync({force : false}).then(()=>{
  console.log("시퀄라이즈 온~")
}).catch(console.log)

module.exports = db;

  
