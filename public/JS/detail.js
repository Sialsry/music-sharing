const musicInfo = document.querySelectorAll('.music-info');
const addToPlayListBtn = document.getElementById('add-to-playlist-btn')
const likeButton = document.getElementById('like-button');
const audio = document.getElementById('audio');
const playPauseBtn = document.getElementById('play-pause-btn');
const seekBar = document.getElementById('seek-bar');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const nextButton = document.getElementById('next-btn');
const prevButton = document.getElementById('prev-btn');
const volumeBar = document.getElementById('volume-bar');
const plusBtn = document.getElementById('plus-button');
const playlistModal = document.getElementById('playlist-modal');
const modalContent = document.getElementById('modal-content');
const createPlaylistBtn =document.getElementById('create-playlist-btn')
const cancelCreateBtn =document.getElementById('cancel-create-btn')
const selectAllCheckbox = document.querySelector('.music-header input[type="checkbox"]');
const musicCheckboxes = document.querySelectorAll('.music-checkbox');


let musicList = [];            // 전체 음악 리스트
let currentMusicId = null;     
let currentMusicIndex = null;  
let history = [];              // 들은 곡 인덱스 저장
let currentHistoryIndex = -1;  // history 안에서 현재 위치

// 🎵 시간 포맷 함수
function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}
// 볼륨바 조절
audio.volume = 0.5;

volumeBar.oninput = () => {
    audio.volume = volumeBar.value;
};

// 🎵 음악 업데이트
function updateMusic(music) {
    document.getElementById('player-title').innerText = music.songName;
    document.getElementById('player-artist').innerText = music.artist;
    document.getElementById('player-img').src = `public/images/musicimages/${music.songImg}`;
    audio.src = `/public/musics/${music.musicResource}`;
    audio.play();

    const playerBar = document.getElementById('custom-player');
    playerBar.style.visibility = 'visible';
    playerBar.style.opacity = '1';

    playPauseBtn.innerText = '⏸️'; // 재생 중 표시
}
musicInfo.forEach((info) => {
    info.onclick =  async (e) => {
        const id = e.currentTarget.dataset.id;

        try {
            const response = await axios.get(`/music/${id}`);
            const { music, liked, musicList: serverMusicList } = response.data;

            updateMusic(music);
            musicList = serverMusicList;
            currentMusicId = id;

            // 🎯 musicList 안에서 클릭한 음악 id를 찾아서 정확한 인덱스 저장
            const foundIndex = musicList.findIndex(item => item.id === music.id);
            currentMusicIndex = foundIndex;

            history = [];
            history.push(currentMusicIndex);
            currentHistoryIndex = 0;

            if (liked) {
                likeButton.innerText = '❤️';
            } else {
                likeButton.innerText = '🤍';
            }
        } catch (error) {
            console.error('음악 가져오기 실패:', error);
        }
    };
});
// 🎵 좋아요 버튼 클릭
likeButton.onclick = async () => {
    try {
        const response = await axios.post(`/music/${currentMusicId}/like`);
        const result = response.data;

        if (result.state === 200) {
            if (result.message === "좋아요 완료") {
                likeButton.innerText = '❤️';
            } else if (result.message === "좋아요 삭제") {
                likeButton.innerText = '🤍';
            }
        } else {
            alert('좋아요 처리 실패');
        }
    } catch (error) {
        console.error('좋아요 실패:', error);
    }
};

// 🎵 재생/일시정지 버튼
playPauseBtn.onclick = () => {
    if (audio.paused) {
        audio.play();
        playPauseBtn.innerText = '⏸️';
    } else {
        audio.pause();
        playPauseBtn.innerText = '▶️';
    }
};

// 🎵 SeekBar (진행바) 조작
seekBar.oninput = () => {
    audio.currentTime = seekBar.value;
};

// 🎵 오디오 시간 업데이트
audio.ontimeupdate = () => {
    seekBar.max = audio.duration || 0;
    seekBar.value = audio.currentTime || 0;

    currentTimeEl.innerText = formatTime(audio.currentTime);
    durationEl.innerText = formatTime(audio.duration);
};

// 🎵 오디오 끝나면 랜덤 셔플 재생
audio.onended = () => {
    playRandomNext();
};

// 🎵 다음곡 버튼 클릭
nextButton.onclick = () => {
    playRandomNext();
};

// 🎵 이전곡 버튼 클릭
prevButton.onclick = async () => {
    if (currentHistoryIndex > 0) {
        currentHistoryIndex -= 1;
        const prevIndex = history[currentHistoryIndex];
        const prevMusic = musicList[prevIndex];
        updateMusic(prevMusic);

        try {
            // 🎯 이전곡 좋아요 상태 다시 요청
            const response = await axios.get(`/music/${prevMusic.id}/likecheck`);
            const { liked } = response.data;

            currentMusicId = prevMusic.id; // 현재 재생곡 id 업데이트
            if (liked) {
                likeButton.innerText = '❤️';
            } else {
                likeButton.innerText = '🤍';
            }
        } catch (error) {
            console.error('이전 곡 좋아요 상태 조회 실패:', error);
        }

    } else {
        console.log('처음 곡입니다. 더 이상 이전 곡이 없습니다.');
    }
};


// 🎵 랜덤 다음곡 함수
async function playRandomNext() {
    
    
    let nextIndex;
    do {
        nextIndex = Math.floor(Math.random() * musicList.length);
    } while (history.length && nextIndex === history[currentHistoryIndex]);
    
    const nextMusic = musicList[nextIndex];
    updateMusic(nextMusic);
    
    history = history.slice(0, currentHistoryIndex + 1);
    history.push(nextIndex);
    currentHistoryIndex = history.length - 1;
    
    try {
        // 🎯 좋아요 상태 다시 요청
        const response = await axios.get(`/music/${nextMusic.id}/likecheck`);
        const { liked } = response.data;

        
        // 🎯 좋아요 상태를 화면에 반영
        currentMusicId = nextMusic.id; // 현재 재생곡 id 업데이트
        if (liked) {
            likeButton.innerText = '❤️';
        } else {
            likeButton.innerText = '🤍';
        }
    } catch (error) {
        console.error('다음 곡 좋아요 상태 조회 실패:', error);
    }
}
// 🎯 + 버튼 누를 때 (모달 열기)
plusBtn.onclick = async () => {
    console.log('🎯 currentMusicId:', currentMusicId);
    try {
        const response = await axios.get('/music/playlist/list', {
            withCredentials: true
        });
        const rawPlaylists = response.data;

        const groupedPlaylists = {};
        rawPlaylists.forEach(item => {
            if (!groupedPlaylists[item.playlistName]) {
                groupedPlaylists[item.playlistName] = {
                    playlistName: item.playlistName,
                    songs: []
                };
            }
            groupedPlaylists[item.playlistName].songs.push(item);
        });

        const playlists = Object.values(groupedPlaylists); 

        playlistModal.style.display = 'flex';
        modalContent.innerHTML = '';

        // 모달 상단 (제목 + 닫기 버튼)
        const header = document.createElement('div');
        header.classList.add('modal-header');

        const title = document.createElement('h2');
        title.innerText = '플레이리스트 선택';
        title.classList.add('modal-title');
        header.appendChild(title);

        const closeButton = document.createElement('button');
        closeButton.innerText = '✖';
        closeButton.classList.add('close-button');
        closeButton.onclick = () => {
            playlistModal.style.display = 'none';
        };
        header.appendChild(closeButton);

        modalContent.appendChild(header);

        playlists.forEach(playlist => {
            const item = document.createElement('div');
            item.innerText = playlist.playlistName;
            item.classList.add('playlist-item');

            // 플레이리스트 클릭 시 현재 노래 추가
            item.onclick = async () => {
                try {
                  const musicIds = window.selectedMusicIds || (currentMusicId ? [currentMusicId] : []);
              
                  if (musicIds.length === 0) {
                    alert('플레이리스트에 담을 곡이 없습니다!');
                    return;
                  }
              
                  // 먼저 서버에서 해당 playlist에 있는 곡 목록 받아오기
                  const checkRes = await axios.get(`/music/playlist/list`, {
                    withCredentials: true
                  });
              
                  const alreadyInPlaylist = checkRes.data.filter(
                    (item) => item.playlistName === playlist.playlistName
                  ).map((item) => item.music_id);
              
                  // 중복 필터링
                  const filtered = musicIds.filter(id => !alreadyInPlaylist.includes(Number(id)));
              
                  if (filtered.length === 0) {
                    alert('이미 해당 재생목록에 추가된 곡입니다!');
                    return;
                  }
              
                  const tempNewSongs = filtered.map(id => ({ music_id: id }));
              
                  await axios.post('/mypage/createPlaylist', {
                    playlistName: playlist.playlistName,
                    tempNewSongs
                  }, {
                    withCredentials: true
                  });
              
                  alert('선택한 곡들이 플레이리스트에 담겼습니다!');
                  playlistModal.style.display = 'none';
                  document.querySelectorAll('.music-checkbox:checked').forEach(cb => cb.checked = false);
                } catch (error) {
                  console.error('플레이리스트 담기 실패:', error);
                  alert('추가 실패!');
                }
              };                

            modalContent.appendChild(item);
        });

        // 새 재생목록 추가 버튼
        const createNewPlaylistBtn = document.createElement('div');
        createNewPlaylistBtn.innerText = '+ 새 재생목록 추가';
        createNewPlaylistBtn.classList.add('create-playlist-button');
        createNewPlaylistBtn.onclick = () => {
            document.getElementById('playlist-modal').style.display = 'none';
            document.getElementById('new-playlist-modal').style.display = 'flex';
        };
        modalContent.appendChild(createNewPlaylistBtn);

    } catch (error) {
        console.error('플레이리스트 가져오기 실패:', error);
    }
};

// 🎯 새 재생목록 만들기 버튼 (현재 음악을 바로 담기)
createPlaylistBtn.onclick = async () => {
    const playlistName = document.getElementById('new-playlist-name').value.trim();
  
    if (!playlistName) {
      alert('재생목록 이름을 입력하세요.');
      return;
    }
  
    // ⛳ 체크된 곡 목록 가져오기
    const checkboxes = document.querySelectorAll('.music-checkbox:checked');
    const selectedIds = Array.from(checkboxes)
    .map(cb => cb.dataset.musicId)
    .filter(id => id); // 빈 값 제거
  
    const validIds = selectedIds.length > 0
      ? selectedIds
      : (currentMusicId ? [currentMusicId] : []);
  
    if (validIds.length === 0) {
      alert('플레이리스트에 담을 곡이 없습니다!');
      return;
    }
  
    const tempNewSongs = validIds
    .map(id => parseInt(id))
    .filter(id => !isNaN(id)) // 숫자만 남기기
    .map(id => ({ music_id: id }));
  
    try {
      await axios.post('/mypage/createPlaylist', {
        playlistName,
        tempNewSongs
            }, {
        withCredentials: true
            });
  
      alert('재생목록이 생성되었습니다.');
      document.getElementById('new-playlist-modal').style.display = 'none';
      playlistModal.style.display = 'none';
      document.querySelectorAll('.music-checkbox:checked').forEach(cb => cb.checked = false);
      selectAllCheckbox.checked = false;
    } catch (error) {
      console.error('생성 실패:', error);
      alert('생성 실패!');
    }
};
  
// 🎯 새 재생목록 모달 취소 버튼
cancelCreateBtn.onclick = () => {
    document.getElementById('new-playlist-modal').style.display = 'none';
};

addToPlayListBtn.onclick = async () => {
    const checked = document.querySelectorAll('.music-checkbox:checked');
    const selectedIds = Array.from(checked).map(cb => cb.dataset.musicId);
  
    if (selectedIds.length === 0) {
      alert('플레이리스트에 담을 곡을 선택해주세요!');
      return;
    }
  
    window.selectedMusicIds = selectedIds;
    playlistModal.style.display = 'flex';
  
    try {
      const response = await axios.get('/music/playlist/list', {
        withCredentials: true
      });
      const rawPlaylists = response.data;
  
      const groupedPlaylists = {};
      rawPlaylists.forEach(item => {
        if (!groupedPlaylists[item.playlistName]) {
          groupedPlaylists[item.playlistName] = {
            playlistName: item.playlistName,
            songs: []
          };
        }
        groupedPlaylists[item.playlistName].songs.push(item);
      });
  
      const playlists = Object.values(groupedPlaylists);
      modalContent.innerHTML = '';
  
      const header = document.createElement('div');
      header.classList.add('modal-header');
      header.innerHTML = `
        <h2 class="modal-title">플레이리스트 선택</h2>
        <button class="close-button">✖</button>
      `;
      header.querySelector('.close-button').onclick = () => {
        playlistModal.style.display = 'none';
      };
      modalContent.appendChild(header);
  
      playlists.forEach(playlist => {
        const item = document.createElement('div');
        item.innerText = playlist.playlistName;
        item.classList.add('playlist-item');
        item.onclick = async () => {
          try {
            const tempNewSongs = window.selectedMusicIds.map(id => ({ music_id: id }));
            await axios.post('/mypage/createPlaylist', {
              playlistName: playlist.playlistName,
              tempNewSongs
            }, {
              withCredentials: true
            });
  
            alert('선택한 곡들이 플레이리스트에 담겼습니다!');
            playlistModal.style.display = 'none';
            document.querySelectorAll('.music-checkbox:checked').forEach(cb => cb.checked = false);
          } catch (err) {
            console.error('추가 실패!', err);
            alert('추가 실패!');
          }
        };
        modalContent.appendChild(item);
      });
  
    const createNewPlaylistBtn = document.createElement('div');
    createNewPlaylistBtn.innerText = '+ 새 재생목록 추가';
    createNewPlaylistBtn.classList.add('create-playlist-button');
    createNewPlaylistBtn.onclick = () => {
        playlistModal.style.display = 'none';
        document.getElementById('new-playlist-modal').style.display = 'flex';
      };
    modalContent.appendChild(createNewPlaylistBtn);
    } catch (error) {
      console.error('플레이리스트 가져오기 실패:', error);
    }
};



// ✅ 상단 체크박스를 눌렀을 때 → 전체 선택 or 해제
selectAllCheckbox.addEventListener('change', () => {
  const checked = selectAllCheckbox.checked;
  musicCheckboxes.forEach(cb => cb.checked = checked);
});

// ✅ 개별 체크박스가 변경됐을 때 → 상단 체크박스 상태 업데이트
musicCheckboxes.forEach(cb => {
  cb.addEventListener('change', () => {
    const allChecked = Array.from(musicCheckboxes).every(cb => cb.checked);
    selectAllCheckbox.checked = allChecked;
  });
});
