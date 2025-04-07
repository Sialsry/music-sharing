require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Music, sequelize } = require('../models/config');  // config.js 기준

const musicDir = path.join(__dirname, '../public/music');  // 프로젝트 기준 경로

(async () => {
  try {
    await sequelize.authenticate();
    console.log('🎵 DB 연결 성공');

    const files = fs.readdirSync(musicDir).filter(file => file.endsWith('.mp3'));

    const musicData = files.map(file => {
      const baseName = path.basename(file, '.mp3');
      const [rawTitle, rawArtist] = baseName.split('-');

      const songName = rawTitle?.trim() || '제목 없음';
      const artist = rawArtist?.trim() || '가수 없음';
      const musicResource = file;
      const songImg = file.replace('.mp3', '.png');

      return { songName, artist, musicResource, songImg };
    });

    await Music.bulkCreate(musicData);
    console.log(`✅ ${musicData.length}개의 음원이 DB에 등록되었습니다.`);
  } catch (err) {
    console.error('❌ 에러 발생:', err);
  } finally {
    await sequelize.close();
    console.log('📴 DB 연결 종료');
  }
})();
