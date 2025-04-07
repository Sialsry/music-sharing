const Sequelize = require('sequelize');
const User = require('./user');
const Music = require('./music');
const Like = require('./like');
const Playlist = require('./playlist');
const Comment = require('./comment');
const Live = require('./live');

const sequelize = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    {
        host: process.env.DATABASE_HOST,
        dialect: 'mysql',
        port: process.env.DATABASE_PORT
    }
);

const users = User.init(sequelize);
const musics = Music.init(sequelize);
const likes = Like.init(sequelize);
const playlists = Playlist.init(sequelize);
const comments = Comment.init(sequelize);
const lives = Live.init(sequelize);

const db = {
    User: users,
    Music: musics,
    Like: likes,
    Playlist: playlists,
    Comment: comments,
    Live: lives,
    sequelize
};

users.associate(db);
musics.associate(db);
likes.associate(db);
playlists.associate(db);
comments.associate(db);
lives.associate(db);

sequelize.sync({ force: false })
    .then(() => { console.log('DB 연결 성공') })
    .catch(console.log);

module.exports = db;
