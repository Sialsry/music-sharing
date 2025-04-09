// 플레이리스트 데이터 (실제로는 서버에서 가져와야 함)
// 서버에서 가져오는 로직
document.querySelectorAll('.playlist-card').forEach(card => {
    card.addEventListener('click', function() {
        const playlistName = this.getAttribute('data-playlist-id');
        axios.get(`/mypage?playlistName=${playlistName}`)
            .then(response => {
                // const playlistsData = response.data.playlistsData;
                const uniquePlaylistNames = response.data.uniquePlaylistNames;
                const songsByPlaylist = response.data.songsByPlaylist;
        
                // 플레이리스트 데이터 가공
                let playlists = {};
                for (let i = 0; i < uniquePlaylistNames.length; i++) {
                    playlists[uniquePlaylistNames[i]] = {
                        title: uniquePlaylistNames[i],
                        coverImage: '../public/images/logo_seaweed.png',
                        creator: '김민교',
                        createdDate: '2023년 7월 15일',
                        songs: songsByPlaylist[i].map((song, index) => ({
                            number: index + 1,
                            title: song.songName,
                            artist: song.artist,
                            liked: false // 기본값 설정
                        }))
                    };
                }
            })
            .catch(error => {
                console.error('Error fetching playlists:', error);
            });
        // openPlaylistPopup(playlistName);

        const playlist = playlists[playlistName];
            console.log(playlists);
            
            // 팝업 데이터 설정
            document.getElementById('popup-title').textContent = playlist.title;
            document.getElementById('popup-cover').src = playlist.coverImage;
            document.getElementById('popup-creator').textContent = playlist.creator;
            document.getElementById('popup-meta').textContent = `생성일: ${playlist.createdDate} • ${playlist.songs.length}곡`;
            
            // 플레이리스트 ID 저장
            document.querySelector('.playlist-popup').setAttribute('data-playlist-id', playlistName);
            
            // 노래 목록 렌더링
            // renderPlaylistSongs(playlistName);

            const songsContainer = document.getElementById('playlist-songs');
            
            // 목록 초기화
            songsContainer.innerHTML = '';
            
            // 노래 목록 생성
            playlist.songs.forEach(song => {
                const songElement = document.createElement('li');
                songElement.className = 'song-item';
                songElement.innerHTML = `
                    <div class="song-number">${song.number}</div>
                    <div class="song-info">
                        <div class="song-title">${song.title}</div>
                        <div class="song-artist">${song.artist}</div>
                    </div>
                    <div class="song-actions">
                        <button class="song-action-btn" title="좋아요">
                            ${song.liked ? '♥' : '♡'}
                        </button>
                        <button class="song-action-btn" title="더 보기">⋯</button>
                    </div>
                `;
                songsContainer.appendChild(songElement);
                
                // 좋아요 버튼 이벤트
                songElement.querySelector('.song-actions button:first-child').addEventListener('click', function() {
                    song.liked = !song.liked;
                    this.textContent = song.liked ? '♥' : '♡';
                });
            });
        




            
            // 팝업 열기
            document.getElementById('playlist-popup-overlay').classList.add('active');
            document.body.style.overflow = 'hidden'; // 배경 스크롤 막기



    });
});
        
        // 플레이리스트 데이터 예시 (실제로는 서버에서 가져와야 함)




// const playlists = {};
        //     for(i = 0; i < uniquePlaylistNames.length; i++) {
        //         uniquePlaylistNames[i]: {
        //             title: uniquePlaylistNames[i],
        //             coverImage: '../public/images/logo_seaweed.png',
        //             creator: '김민교',
        //             createdDate: '2023년 7월 15일',
        //             songs: songsByPlaylist[i].map((song, index) => ({
        //                 number: index + 1,
        //                 title: song.songName,
        //                 artist: song.artist,
        //                 liked: false // 기본값 설정
        //             }))
                    
        //         }
        //     }
        

        // 플레이리스트 카드 클릭 이벤트
        // document.querySelectorAll('.playlist-card').forEach(card => {
        //     card.addEventListener('click', function() {
        //         const playlistId = this.getAttribute('data-playlist-id');
        //         openPlaylistPopup(playlistId);
        //     });
        // });

        // 팝업 닫기 버튼 이벤트
        document.getElementById('close-popup').addEventListener('click', function() {
            closePlaylistPopup();
        });

        // 팝업 외부 클릭 시 닫기
        document.getElementById('playlist-popup-overlay').addEventListener('click', function(e) {
            if (e.target === this) {
                closePlaylistPopup();
            }
        });

        // 곡 추가 폼 토글 버튼
        document.getElementById('add-songs-toggle').addEventListener('click', function() {
            const songsContainer = document.getElementById('playlist-songs');
            songsContainer.innerHTML = '';
            const form = document.getElementById('add-song-form');
            form.classList.toggle('active');
            this.textContent = form.classList.contains('active') ? '- 취소하기' : '+ 곡 추가하기';
        });

        // 곡 추가 취소 버튼
        document.getElementById('cancel-add').addEventListener('click', function() {
            document.getElementById('add-song-form').classList.remove('active');
            document.getElementById('add-songs-toggle').textContent = '+ 곡 추가하기';
            // 폼 초기화
            document.getElementById('song-title').value = '';
            document.getElementById('song-artist').value = '';

            const currentPlaylistId = document.querySelector('.playlist-popup').getAttribute('data-playlist-id');
            renderPlaylistSongs(currentPlaylistId);
        });

        // 곡 추가 확인 버튼
        document.getElementById('confirm-add').addEventListener('click', function() {
            const title = document.getElementById('song-title').value;
            const artist = document.getElementById('song-artist').value;
            
            if (title && artist) {
                const currentPlaylistId = document.querySelector('.playlist-popup').getAttribute('data-playlist-id');
                
                // 새 노래 번호 계산
                const newSongNumber = playlists[currentPlaylistId].songs.length + 1;
                
                // 새 노래 객체 생성
                const newSong = {
                    number: newSongNumber,
                    title: title,
                    artist: artist,
                    liked: false
                };
                
                // 플레이리스트에 노래 추가
                playlists[currentPlaylistId].songs.push(newSong);
                
                // 목록 다시 렌더링
                renderPlaylistSongs(currentPlaylistId);
                
                // 폼 초기화 및 닫기
                document.getElementById('add-song-form').classList.remove('active');
                document.getElementById('add-songs-toggle').textContent = '+ 곡 추가하기';
                document.getElementById('song-title').value = '';
                document.getElementById('song-artist').value = '';
                
                // 성공 메시지 알림
                alert('곡이 추가되었습니다!');
            } else {
                alert('제목, 아티스트, 재생 시간은 필수 입력 항목입니다.');
            }
        });

        // 라이브 스트리밍 시작 버튼 이벤트
        document.querySelector('.start-streaming-btn').addEventListener('click', function() {
            const currentPlaylistId = document.querySelector('.playlist-popup').getAttribute('data-playlist-id');
            const playlistTitle = playlists[currentPlaylistId].title;
            
            // 스트리밍 페이지로 이동
            alert(`"${playlistTitle}" 플레이리스트로 라이브 스트리밍을 시작합니다.`);
            // 실제로는 아래와 같이 페이지 이동이 있을 것입니다
            // window.location.href = `/live?playlist=${currentPlaylistId}`;
        });

        // 플레이리스트 팝업 열기 함수
        function openPlaylistPopup(playlistId) {
            const playlist = playlists[playlistId];
            console.log(playlists);
            
            // 팝업 데이터 설정
            document.getElementById('popup-title').textContent = playlist.title;
            document.getElementById('popup-cover').src = playlist.coverImage;
            document.getElementById('popup-creator').textContent = playlist.creator;
            document.getElementById('popup-meta').textContent = `생성일: ${playlist.createdDate} • ${playlist.songs.length}곡`;
            
            // 플레이리스트 ID 저장
            document.querySelector('.playlist-popup').setAttribute('data-playlist-id', playlistId);
            
            // 노래 목록 렌더링
            renderPlaylistSongs(playlistId);
            
            // 팝업 열기
            document.getElementById('playlist-popup-overlay').classList.add('active');
            document.body.style.overflow = 'hidden'; // 배경 스크롤 막기
        }

        // 플레이리스트 팝업 닫기 함수
        function closePlaylistPopup() {
            document.getElementById('playlist-popup-overlay').classList.remove('active');
            document.body.style.overflow = '';
            // 곡 추가 폼 닫기
            document.getElementById('add-song-form').classList.remove('active');
            document.getElementById('add-songs-toggle').textContent = '+ 곡 추가하기';
        }

        // 플레이리스트 노래 목록 렌더링 함수
        function renderPlaylistSongs(playlistId) {
            const playlist = playlists[playlistId];
            const songsContainer = document.getElementById('playlist-songs');
            
            // 목록 초기화
            songsContainer.innerHTML = '';
            
            // 노래 목록 생성
            playlist.songs.forEach(song => {
                const songElement = document.createElement('li');
                songElement.className = 'song-item';
                songElement.innerHTML = `
                    <div class="song-number">${song.number}</div>
                    <div class="song-info">
                        <div class="song-title">${song.title}</div>
                        <div class="song-artist">${song.artist}</div>
                    </div>
                    <div class="song-actions">
                        <button class="song-action-btn" title="좋아요">
                            ${song.liked ? '♥' : '♡'}
                        </button>
                        <button class="song-action-btn" title="더 보기">⋯</button>
                    </div>
                `;
                songsContainer.appendChild(songElement);
                
                // 좋아요 버튼 이벤트
                songElement.querySelector('.song-actions button:first-child').addEventListener('click', function() {
                    song.liked = !song.liked;
                    this.textContent = song.liked ? '♥' : '♡';
                });
            });
        }




// --------------------------------------------------------새 플레이리스트 생성 관련 기능

// 새 플레이리스트 버튼 이벤트 연결
document.querySelector('a.edit-profile:nth-child(2)').addEventListener('click', function(e) {
    e.preventDefault();
    openCreatePlaylistPopup();
});

// 새 플레이리스트 팝업 열기
function openCreatePlaylistPopup() {
    document.getElementById('create-playlist-overlay').classList.add('active');
    document.body.style.overflow = 'hidden'; // 배경 스크롤 방지
    
    // 폼 초기화
    document.getElementById('new-playlist-name').value = '';
    document.getElementById('create-playlist-songs').innerHTML = '';
    document.getElementById('create-playlist-btn').disabled = true;
    updateEmptySongsMessage();
    
    tempNewSongs = [];
}

// 새 플레이리스트 팝업 닫기
function closeCreatePlaylistPopup() {
    document.getElementById('create-playlist-overlay').classList.remove('active');
    document.body.style.overflow = ''; // 배경 스크롤 복원
    // 곡 추가 폼 닫기
    document.getElementById('add-song-to-new-form').classList.remove('active');
    document.getElementById('add-song-to-new-toggle').textContent = '+ 곡 추가하기';
}

// 임시 저장용 배열
let tempNewSongs = [];

// 곡 추가 폼 토글
document.getElementById('add-song-to-new-toggle').addEventListener('click', function() {
    const form = document.getElementById('add-song-to-new-form');
    form.classList.toggle('active');
    this.textContent = form.classList.contains('active') ? '- 취소하기' : '+ 곡 추가하기';
});

// 곡 추가 취소 버튼
document.getElementById('cancel-add-to-new').addEventListener('click', function() {
    document.getElementById('add-song-to-new-form').classList.remove('active');
    document.getElementById('add-song-to-new-toggle').textContent = '+ 곡 추가하기';
    document.getElementById('new-song-title').value = '';
});

function updateEmptySongsMessage() { // 비어있는 곡 메시지 업데이트
    const songsContainer = document.getElementById('create-playlist-songs');
    const emptyMessage = document.querySelector('.empty-songs-message');

    if (tempNewSongs.length === 0) {
        if (!emptyMessage) {
            const message = document.createElement('div');
            message.className = 'empty-songs-message';
            message.textContent = '아직 추가된 곡이 없습니다. 곡을 추가해주세요.';
            songsContainer.appendChild(message);
        }
    } else {
        if (emptyMessage) {
            emptyMessage.remove();
        }
    }
}

// 새 플레이리스트 노래 목록 렌더링
function renderNewPlaylistSongs() {
    const songsContainer = document.getElementById('create-playlist-songs');
    
    // 목록 초기화
    songsContainer.innerHTML = '';
    
    // 노래 목록 생성
    tempNewSongs.forEach(song => {
        const songElement = document.createElement('li');
        songElement.className = 'song-item';
        songElement.innerHTML = `
            <div class="song-number">${song.number}</div>
            <div class="song-info">
                <div class="song-title">${song.songName}</div>
                <div class="song-artist">${song.artist}</div>
            </div>
            <div class="song-actions">
                <button class="song-action-btn remove-song-btn" title="제거">✕</button>
            </div>
        `;
        songsContainer.appendChild(songElement);
        
        // 노래 제거 버튼 이벤트
        songElement.querySelector('.remove-song-btn').addEventListener('click', function() {
            const index = tempNewSongs.findIndex(s => s.songName === song.songName && s.artist === song.artist);
            if (index !== -1) {
                tempNewSongs.splice(index, 1);
                
                // 번호 재설정
                tempNewSongs.forEach((s, i) => { s.number = i + 1; });
                
                // 목록 다시 렌더링
                renderNewPlaylistSongs();
                
                // 비어있으면 생성 버튼 비활성화
                if (tempNewSongs.length === 0) {
                    document.getElementById('create-playlist-btn').disabled = true;
                }
                
                // 곡 없음 메시지 업데이트
                updateEmptySongsMessage();
            }
        });
    });
}

// 플레이리스트 생성 버튼 클릭
document.getElementById('create-playlist-btn').addEventListener('click', function() {
    const playlistName = document.getElementById('new-playlist-name').value.trim();
    if (!playlistName) {
        showErrorAlert('플레이리스트 이름을 입력해주세요.');
        return;
    }
    if (tempNewSongs.length === 0) {
        showErrorAlert('플레이리스트에는 최소 한 개의 곡이 필요합니다.');
        return;
    }
    
    // 새 플레이리스트 ID 생성 (이름의 소문자화 및 공백을 대시로 변환)
    const newPlaylistId = playlistName.toLowerCase().replace(/\s+/g, '-');
    
    // 현재 날짜로 생성일 설정
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월 ${currentDate.getDate()}일`;
    

    // 서버에 새 플레이리스트 생성 요청
    axios.post('/mypage/createPlaylist', {
        playlistName,
        tempNewSongs,
        user_id: '123' // 현재 사용자 ID (예시로 1 사용, 실제로는 로그인한 사용자 ID 사용)
    })
    .then(response => {
        console.log('플레이리스트 생성 성공:', response.data);
    })
    .catch(error => {
        console.error('플레이리스트 생성 실패:', error);
        showErrorAlert('플레이리스트 생성 중 오류가 발생했습니다.');
    });

    // 새 플레이리스트 객체 생성
    playlists[newPlaylistId] = {
        title: playlistName,
        coverImage: '../public/images/logo_seaweed.png',
        creator: '김민교',
        createdDate: formattedDate,
        songs: [...tempNewSongs]  // 복사본 생성
    };
    
    // 새 플레이리스트 카드 추가
    addPlaylistCard(newPlaylistId, playlistName, formattedDate);
    // 팝업 닫기
    closeCreatePlaylistPopup();
    // 성공 메시지 표시
    showSuccessAlert(`'${playlistName}' 플레이리스트가 생성되었습니다!`);
});

// 새 플레이리스트 카드 추가
function addPlaylistCard(playlistId, title, createdDate) {
    const playlistGrid = document.querySelector('.playlist-grid');
    
    const card = document.createElement('div');
    card.className = 'playlist-card';
    card.setAttribute('data-playlist-id', playlistId);
    
    card.innerHTML = `
        <img src="../public/images/logo_seaweed.png">
        <div class="playlist-info">
            <h3>${title}</h3>
            <p>Created: ${createdDate}</p>
            <div class="play-count">
                <span>▶ 0 plays</span>
            </div>
        </div>
    `;
    
    playlistGrid.appendChild(card);
    
    // 새 카드에 클릭 이벤트 추가
    card.addEventListener('click', function() {
        const cardPlaylistId = this.getAttribute('data-playlist-id');
        openPlaylistPopup(cardPlaylistId);
    });
}

// 에러 알림 표시
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

// 팝업 닫기 버튼 이벤트
document.getElementById('close-create-popup').addEventListener('click', closeCreatePlaylistPopup);

// 팝업 외부 클릭 시 닫기
document.getElementById('create-playlist-overlay').addEventListener('click', function(e) {
    if (e.target === this) {
        closeCreatePlaylistPopup();
    }
});
 

// 추가할 곡 검색 기능
document.getElementById("new-song-title").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        const searchQuery = document.getElementById("new-song-title").value;
        axios.get(`mypage/search?index=${searchQuery}`)
        .then(response => {
            const results = response.data.results;
            const songsContainer = document.getElementById("create-playlist-songs");
            songsContainer.innerHTML = ''; // 기존 결과 초기화

            if (results.length > 0) { 
                results.forEach(music => { 
                    const songImg = document.createElement("img");
                    songImg.src = music.songImg;
                    const songName = document.createElement("div");
                    songName.innerHTML = music.songName;
                    const artist = document.createElement("div");
                    artist.innerHTML = music.artist;
                    const addButton = document.createElement("button");
                    addButton.innerHTML = "추가하기";

                    addButton.onclick = () => {
                        const newSong = {
                            number: tempNewSongs.length + 1,
                            songName: music.songName,
                            artist: music.artist,
                            liked: false,
                            music_id: music.id,
                        };
                        
                        // 임시 배열에 노래 추가
                        tempNewSongs.push(newSong);
                        
                        // 목록 다시 렌더링
                        renderNewPlaylistSongs();
                        
                        // 폼 초기화 및 닫기
                        document.getElementById('add-song-to-new-form').classList.remove('active');
                        document.getElementById('add-song-to-new-toggle').textContent = '+ 곡 추가하기';
                        document.getElementById('new-song-title').value = '';
                        
                        // 생성 버튼 활성화
                        document.getElementById('create-playlist-btn').disabled = false;
                        
                        // 곡 없음 메시지 업데이트
                        updateEmptySongsMessage();
                    }



                    const songItem = document.createElement("li");
                    songItem.append(songImg, songName, artist, addButton);
                    songsContainer.appendChild(songItem);
                });
            } else { 
                const emptyMessage = document.createElement("div");
                emptyMessage.innerHTML = "검색 결과가 없습니다.";
                songsContainer.appendChild(emptyMessage);
            } 

        })
        .catch(error => {
            console.error("검색 오류:", error);
            const songsContainer = document.getElementById("create-playlist-songs");
            songsContainer.innerHTML = ''; // 기존 결과 초기화
            const errorMessage = document.createElement("div");
            errorMessage.innerHTML = "검색 중 오류가 발생했습니다.";
            songsContainer.appendChild(errorMessage);
        });
    }
});



    
    
    