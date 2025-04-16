// 🎵 요소 가져오기
const musicForms = document.querySelectorAll('.music-form');
const chartItems = document.querySelectorAll('.mini-chart-item');
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
const createPlaylistBtn =document.getElementById('create-playlist-btn')
const playlistModal = document.getElementById('playlist-modal');
const modalContent = document.getElementById('modal-content');


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
    document.getElementById('player-title').innerText = music.artist;
    document.getElementById('player-artist').innerText = music.songName;
    document.getElementById('player-img').src = `public/images/musicimages/${music.songImg}`;
    audio.src = `/public/musics/${music.musicResource}`;
    audio.play();

    const playerBar = document.getElementById('custom-player');
    playerBar.style.visibility = 'visible';
    playerBar.style.opacity = '1';

    playPauseBtn.innerText = '⏸️'; // 재생 중 표시
}

// 🎵 음악 카드 클릭
musicForms.forEach((form) => {
    form.onclick = async (e) => {
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

// 🎵 미니차트 아이템 클릭
chartItems.forEach((item) => {
    item.onclick = async (e) => {
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
                showSuccessAlert("좋아요 완료")
            } else if (result.message === "좋아요 삭제") {
                likeButton.innerText = '🤍';
                showErrorAlert("좋아요 삭제");
            }
        }
    } catch (error) {
        console.error('좋아요 실패:', error);
        showErrorAlert('로그인 해야만 가능한 서비스입니다. 로그인 해주세요!')
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
        showErrorAlert('처음 곡입니다. 더 이상 이전 곡이 없습니다.');
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
        title.innerText = '플레이 리스트 선택';
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

            // 플레이 리스트 클릭 시 현재 노래 추가
            item.onclick = async () => {
                try {
                    await axios.post('/mypage/addSongToPlaylist', {
                        playlistName: playlist.playlistName,
                        music_id: currentMusicId
                    }, {
                        withCredentials: true
                    });
                    showSuccessAlert('노래가 플레이리스트에 추가되었습니다.');
                    playlistModal.style.display = 'none';
                } catch (error) {
                    console.error('플레이리스트에 추가 실패:', error);
                    showErrorAlert('노래 중복. 추가 실패!');
                }
            };

            modalContent.appendChild(item);
        });

        // 새 플레이 리스트 추가 버튼
        const createNewPlaylistBtn = document.createElement('div');
        createNewPlaylistBtn.innerText = '+ 새 플레이 리스트 추가';
        createNewPlaylistBtn.classList.add('create-playlist-button');
        createNewPlaylistBtn.onclick = () => {
            document.getElementById('playlist-modal').style.display = 'none';
            document.getElementById('new-playlist-modal').style.display = 'flex';
        };
        modalContent.appendChild(createNewPlaylistBtn);

    } catch (error) {
        console.error('플레이리스트 가져오기 실패:', error);
        showErrorAlert('로그인 해야만 가능한 서비스입니다. 로그인 해주세요!')
    }
};

// 🎯 새 플레이 리스트 만들기 버튼 (현재 음악을 바로 담기)
createPlaylistBtn.onclick = async () => {
    const playlistName = document.getElementById('new-playlist-name').value.trim();
    document.getElementById('new-playlist-name').value = ""
    if (playlistName) {
        try {
            const regex = /^[a-zA-Z0-9\s]+$/;
            if(!regex.test(playlistName)) return showErrorAlert('특수문자를 제외해주세요.')
            await axios.post('/mypage/createPlaylist', {
                playlistName: playlistName,
                tempNewSongs: [{ music_id: currentMusicId }] 
            }, {
                withCredentials: true  
            });
            showSuccessAlert('플레이리스트가 생성되었습니다.');
            document.getElementById('new-playlist-modal').style.display = 'none';
            playlistModal.style.display = 'none';
        } catch (error) {
            console.error('생성 실패:', error);
            showErrorAlert('플레이 리스트 이름이 너무 깁니다.');
        }
    } else {
        showErrorAlert('플레이 리스트 이름을 입력하세요.');
    }
};

// 🎯 새 플레이 리스트 모달 취소 버튼
document.getElementById('cancel-create-btn').onclick = () => {
    document.getElementById('new-playlist-name').value = ""
    document.getElementById('new-playlist-modal').style.display = 'none';
};
// 실패 알림
function showErrorAlert(message) {
    const alertElement = document.createElement('div');
    alertElement.className = 'error-alert';
    alertElement.textContent = message;
    
    document.body.appendChild(alertElement);
    
    setTimeout(() => {
        alertElement.classList.add('show');
    }, 10);
  
    setTimeout(() => {
        alertElement.classList.remove('show');
        setTimeout(() => {
            alertElement.remove();
        }, 300);
    }, 3000);
  }
  
  // 성공 알림 표시
  function showSuccessAlert(message) {
    const alertElement = document.createElement('div');
    alertElement.className = 'error-alert';
    alertElement.style.backgroundColor = '#4CAF50';
    alertElement.textContent = message;
    document.body.appendChild(alertElement);
    
    setTimeout(() => {
        alertElement.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        alertElement.classList.remove('show');
        setTimeout(() => {
            alertElement.remove();
        }, 300);
    }, 3000);
  }
  
