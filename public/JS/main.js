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

// 🎵 음악 업데이트
function updateMusic(music) {
    document.getElementById('player-title').innerText = music.songName;
    document.getElementById('player-artist').innerText = music.artist;
    document.getElementById('player-img').src = `/public/images/musicimages${music.songImg}`;
    audio.src = `/public/musics/${music.musicResource}`;
    audio.play();

    const playerBar = document.getElementById('custom-player');
    playerBar.style.visibility = 'visible';
    playerBar.style.opacity = '1';

    playPauseBtn.innerText = '⏸️'; // 재생 중 표시
}

// 🎵 음악 카드 클릭
musicForms.forEach((form, index) => {
    form.onclick = async (e) => {
        const id = e.currentTarget.dataset.id;
        console.log('클릭한 음악 id:', id);

        try {
            const response = await axios.get(`/music/${id}`);
            const { music, liked, musicList: serverMusicList } = response.data;

            updateMusic(music);
            musicList = serverMusicList;
            currentMusicId = id;
            currentMusicIndex = index;

            history = []; // 클릭할 때 새로 시작
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
chartItems.forEach((item, index) => {
    item.onclick = async (e) => {
        const id = e.currentTarget.dataset.id;
        console.log('미니차트에서 클릭한 음악 id:', id);

        try {
            const response = await axios.get(`/music/${id}`);
            const { music, liked, musicList: serverMusicList } = response.data;

            updateMusic(music);
            musicList = serverMusicList;
            currentMusicId = id;
            currentMusicIndex = index;

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
prevButton.onclick = () => {
    if (currentHistoryIndex > 0) {
        currentHistoryIndex -= 1;
        const prevIndex = history[currentHistoryIndex];
        const prevMusic = musicList[prevIndex];
        updateMusic(prevMusic);
    } else {
        console.log('처음 곡입니다. 더 이상 이전 곡이 없습니다.');
    }
};

// 🎵 랜덤 다음곡 함수
function playRandomNext() {
    if (!musicList.length) return;

    let nextIndex;
    do {
        nextIndex = Math.floor(Math.random() * musicList.length);
    } while (history.length && nextIndex === history[currentHistoryIndex]);

    const nextMusic = musicList[nextIndex];
    updateMusic(nextMusic);

    history = history.slice(0, currentHistoryIndex + 1); // 새로운 곡이면 이후 히스토리 삭제
    history.push(nextIndex);
    currentHistoryIndex = history.length - 1;
}
