const Sequelize = require('sequelize');
const {user} = require('./user');

exports.sequelize = new Sequelize(
  process.env.DATABASE_NAME, // 사용할 데이터 베이스 이름
  process.env.DATABASE_USER, // 사용할 계정(유저) 이름
  process.env.DATABASE_PASSWORD, // 사용할 계정의 비밀번호 
  { // 사용할 데이터베이스의 속성
    host : process.env.DATABASE_HOST,
    dialect : "mysql",
    port : process.env.DATABASE_PORT
  }
);

