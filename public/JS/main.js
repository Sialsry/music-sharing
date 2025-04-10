
// 숨겨진 오디오 태그
const audio = document.getElementById('audio');

// 커스텀 플레이어 요소
const playPauseBtn = document.getElementById('play-pause-btn');
const seekBar = document.getElementById('seek-bar');
const currentTimeDisplay = document.getElementById('current-time');
const durationDisplay = document.getElementById('duration');
const likeButton = document.getElementById('like-button');

// 음악 카드들
const musicForms = document.querySelectorAll('.music-form');

let currentMusicId = null; // 현재 선택된 음악 id

// ▶️ 재생 / ⏸️ 일시정지 버튼 클릭
playPauseBtn.onclick = () => {
    if (audio.paused) {
        audio.play();
        playPauseBtn.innerText = '⏸️';
    } else {
        audio.pause();
        playPauseBtn.innerText = '▶️';
    }
};

// 진행 바 업데이트 (음악 재생 중)
audio.ontimeupdate = () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    seekBar.value = progress || 0;
    updateTimeDisplay();
};

// 바를 움직이면 현재 시간 이동
seekBar.oninput = () => {
    const newTime = (seekBar.value / 100) * audio.duration;
    audio.currentTime = newTime;
};

// 시간 포맷 함수
function formatTime(time) {
    const minutes = Math.floor(time / 60) || 0;
    const seconds = Math.floor(time % 60) || 0;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// 현재 시간/총 시간 표시
function updateTimeDisplay() {
    currentTimeDisplay.innerText = formatTime(audio.currentTime);
    durationDisplay.innerText = formatTime(audio.duration);
}



// 플레이어에 음악 정보 업데이트
function updateMusic(music) {
    const playerImg = document.getElementById('player-img');
    const playerTitle = document.getElementById('player-title');
    const playerArtist = document.getElementById('player-artist');

    audio.src = `/public/musics/${music.musicResource}`;
    playerImg.src = `/public/images/musicimages/${music.songImg}`;
    playerTitle.innerText = music.songName;
    playerArtist.innerText = music.artist;

    currentMusicId = music.id; // 현재 음악 id 저장
    audio.play();
    playPauseBtn.innerText = '⏸️';

    // 플레이어 보이게 (처음에 숨겨놨던 경우)
    const playerBar = document.getElementById('custom-player');
    playerBar.style.visibility = 'visible';
    playerBar.style.opacity = '1';
}

// 음악 카드 클릭하면 서버에서 음악 가져오기
musicForms.forEach(form => {
    form.onclick = async (e) => {
        const id = e.currentTarget.dataset.id;
        console.log('클릭한 음악 id:', id);

        try {
            const response = await axios.get(`/music/${id}`);
            const music = response.data;

            console.log('서버가 준 음악:', music);
            updateMusic(music);
        } catch (error) {
            console.error('음악 가져오기 실패:', error);
        }
    };
});

// ❤️ 좋아요 버튼 클릭
likeButton.onclick = async () => {
    try {
        const response = await axios.post(`/music/${currentMusicId}/like`);
        const result = response.data;

        if (result.state === 200) {
            alert('좋아요 완료!');
        } else {
            alert('이미 좋아요를 눌렀습니다.');
        }
    } catch (error) {
        console.error('좋아요 실패:', error);
    }
};
