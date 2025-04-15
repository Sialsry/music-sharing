const db = require('../models/config');

const getUserPlaylist = async (req, res) => {
  try {
    const user = await db.User.findOne({
      where: { uid: 'user123' }
    });

    if (!user) {
      return res.status(404).send('User not found');
    }

    const playlists = await db.Playlist.findAll({
      where: { user_id: 'user123' },
      include: [{
        model: db.Music,
        required: false
      }]
    });

    res.render('mypage', {
      user,
      playlists
    });
  } catch (err) {
    console.error('Error in getUserPlaylist:', err);
    res.status(500).send('Server error');
  }
};

const getPlaylistMusic = async (req, res) => {
  try {
    const { playlistName } = req.params;

    const playlist = await db.Playlist.findAll({
      where: { playlistName },
      include: [{ model: db.Music }]
    });

    if (!playlist || playlist.length === 0) {
      return res.status(404).send('Playlist not found');
    }

    const musicData = playlist.map(p => p.Music).flat();
    res.json(musicData);
  } catch (err) {
    console.error('Error in getPlaylistMusic:', err);
    res.status(500).send('Server error');
  }
};

updateLiveStatus = async (req, res) => {
  const { islive, playlistName } = req.body;

  console.log("요청된 islive:", islive);
  console.log("요청된 playlistName:", playlistName);

  // playlistName이 없으면 에러 반환
  if (!playlistName) {
    return res.status(400).json({ success: false, message: "playlistName이 필요합니다." });
  }

  try {
    // playlistName이 같은 모든 playlist의 isLive를 변경
    await db.Playlist.update(
      { isLive: islive },
      { where: { playlistName } }
    );

    res.json({ success: true });
  } catch (error) {
    console.error("라이브 상태 업데이트 실패:", error);
    res.status(500).json({ success: false });
  }
};
module.exports = {getUserPlaylist, getPlaylistMusic, updateLiveStatus};
