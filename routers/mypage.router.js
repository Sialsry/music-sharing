const router = require('express').Router();
const PostController = require('../controllers/post.controller');
const playlistController = require('../controllers/playlist.controller');

router.get('/', async (req, res) => {
    const {user} = req
    const user_id = '123'
    const playlistsData = await playlistController.getAllPlaylists(user_id);
    // console.log("playlistsData:", playlistsData);
    const playlistNames = playlistsData.map((playlist) => playlist.playlistName);
    const uniquePlaylistNames = [...new Set(playlistNames)];
    songsByPlaylist = uniquePlaylistNames.map((playlistName) => {
        return playlistsData.map((playlist) => {
            if (playlist.playlistName === playlistName) {
                return playlist.Music;
            }
        }).filter((song) => song !== undefined);
    });
    playlistAndSongs = uniquePlaylistNames.map((playlistName) => {
        return {
            name: playlistName,
            songs: songsByPlaylist.shift()
        };
    });
    res.render('myPage', { playlistAndSongs, user })
});

router.get('/live', async (req, res) => {
    const playlistName = req.query.playlistName
    res.render('liveStreaming', { playlistName })
})




router.get('/getPlaylistByName', async (req, res) => {
    const playlistName = req.query.index || '';
    const playlist = await playlistController.getPlaylistByName(playlistName);
    res.send({ playlist });
})




router.get('/search', async (req, res) => { 
    const searchQuery = req.query.index || '';
    const results = await PostController.selectAll(searchQuery); 
    res.send({ results }); 
});

router.post('/createPlaylist', async (req, res) => {
    const { playlistName, tempNewSongs, user_id } = req.body;
    try {
        for (let i = 0; i < tempNewSongs.length; i++) {
            await playlistController.createPlaylist(playlistName, tempNewSongs[i].music_id, user_id); // Create a playlist for each song
        }
        res.status(200).send('Playlist created successfully');
    } catch (error) {
        console.error('Error creating playlist:', error);
        res.status(500).send('Error creating playlist');
    }
})

router.post('/deletePlaylist', async (req, res) => {
    const { playlistId } = req.body;
    try {
        await playlistController.deletePlaylist(playlistId);
        res.status(200).send('Playlist deleted successfully');
    } catch (error) {
        console.error('Error deleting playlist:', error);
        res.status(500).send('Error deleting playlist');
    }
})

router.post('/addSongToPlaylist', async (req, res) => {
    const { playlistName, music_id, user_id } = req.body;
    console.log("playlistName:", playlistName);
    console.log("music_id:", music_id);
    console.log("user_id:", user_id);
    try {
        await playlistController.createPlaylist(playlistName, music_id, user_id);
        res.status(200).send('Song added to playlist successfully');
    } catch (error) {
        console.error('Error adding song to playlist:', error);
        res.status(500).send('Error adding song to playlist');
    }
})

router.post('/deleteSongFromPlaylist', async (req, res) => {
    const { playlistName, music_id } = req.body;
    try {
        await playlistController.deleteSongFromPlaylist(playlistName, music_id);
        res.status(200).send('Song deleted from playlist successfully');
    } catch (error) {
        console.error('Error deleting song from playlist:', error);
        res.status(500).send('Error deleting song from playlist');
    }
})



module.exports = router;