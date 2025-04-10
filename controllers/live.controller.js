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

module.exports = {getUserPlaylist, getPlaylistMusic};
