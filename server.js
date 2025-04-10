require('dotenv').config();
require('./models/config');
const express = require('express');
const socketIo = require('socket.io'); 
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { detailRouter, mainRouter, liveRouter, mypageRouter, searchViewRouter ,musicRouter, loginCheck} = require('./routers');
const Playlist  = require('./models/config'); 
const cookieParser = require('cookie-parser');

const app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false })); 
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/music", express.static(path.join(__dirname, "public/musics")));
app.use(cookieParser());
app.use(loginCheck);


app.use('/', mainRouter);
app.use('/detail', detailRouter);
app.use('/music', musicRouter);
app.use('/live', liveRouter);
app.use('/mypage', mypageRouter);
app.use('/search', searchViewRouter);

const videosDir = path.join(__dirname, "public/videos");
if (!fs.existsSync(videosDir)) {
  fs.mkdirSync(videosDir, { recursive: true });
}

// 서버 열기
const server = app.listen(3000, () => {
    console.log('server on~');
});

// socket.io 연결
const io = socketIo(server);


// const getLivePlaylistFromDB = async (playlistId) => {
//     try {
//         const playlist = await Playlist.findOne({ _id: playlistId });  // 실제 DB에서 플레이리스트 조회
//         return playlist ? playlist.songs : [];  // 노래 목록 반환
//     } catch (error) {
//         console.error(error);
//         return [];
//     }
// };

const onlineUsers = new Set();

io.use((socket, next) => {
  const token = socket.handshake.headers.cookie
    ?.split('; ')
    .find(cookie => cookie.startsWith('login_access_token='))
    ?.split('=')[1];

  if (token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_SECRET_KEY);
      socket.user = userData;
      console.log('유저 검색 완료',userData);
    } catch (err) {
      console.error('JWT 검증 실패:', err.message);
    }
  }
  next();
});

// socket.io 이벤트 설정
io.on('connection', (socket) => {
  const nickName = socket.user?.properties?.nickname;
  if (nickName) {
    console.log(`${nickName}님이 접속하셨습니다.`);
    onlineUsers.add(nickName);

    // 모든 클라이언트에게 접속자 목록 전송
    io.emit('updateUserList', Array.from(onlineUsers));
  }

    ///////////////////////////////////////////////////////// 성공 

     // 역할에 따라 방 입장 및 초기화
     socket.on("join", (role) => {
      socket.role = role;
    
      // JWT에서 가져온 uid
      const uid = socket.user?.id; 
      if (!uid) {
        console.log("❌ 유저 정보가 없음");
        return;
      }
      if (role === "viewer") {
        socket.join("viewers");
        console.log(`시청자 접속 : views`);
      } else if (role === "host") {
        socket.join("hosts");
        console.log(`호스트 접속 (uid: ${uid})`);
        const videoFileName = `recorded_video_${Date.now()}.webm`;
        socket.videoFileName = videoFileName;
        socket.videoPath = path.join(videosDir, videoFileName);
        socket.writeStream = fs.createWriteStream(socket.videoPath, {
          flags: "a",
        });
      }
    });
    

  
  // 호스트 영상 청크 처리
socket.on("videoChunk", (chunk) => {
  console.log("11234")
  if (
    socket.role === "host" &&
    socket.writeStream &&
    socket.writeStream.writable
  ) {
    if (!socket.writeStream.write(Buffer.from(chunk))) {
      socket.writeStream.once("drain", () => {
        console.log("스트림 드레인 완료.");
      });
    }
    io.to("viewers").emit("videoChunk", chunk);
  }
});

  // 녹화 종료 처리
  socket.on("endRecording", () => {
    if (socket.role === "host" && socket.writeStream) {
      socket.writeStream.end(() => {
        console.log(`비디오 저장 완료: ${socket.videoPath}`);
        socket.emit("videoSaved", { fileName: socket.videoFileName });
        io.to("viewers").emit("endRecording");
      });
    }
  });

  ///////////////////////////////////////////////////////// 드디어 됌.
    // 클라이언트가 메시지 전송
    socket.on('sendMessage', (message) => {
      try {
        console.log('받은 메시지:', message);
        io.emit('receiveMessage', message);
      } catch (err) {
        console.error('sendMessage 처리 중 오류:', err);
      }
    });




    socket.on('disconnect', () => {
      if (nickName) {
        onlineUsers.delete(nickName);
        console.log(`${nickName}님이 퇴장하셨습니다.`);
  
        // 업데이트된 접속자 목록 전송
        io.emit('updateUserList', Array.from(onlineUsers));
      }
      if (socket.role === "host" && socket.writeStream) {
        socket.writeStream.end(() => {
          console.log("강제 종료된 호스트 스트림 종료");
        });
      }
    });
});

process.on('uncaughtException', (err) => {
  console.error('uncaughtException:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('unhandledRejection:', reason);
});
