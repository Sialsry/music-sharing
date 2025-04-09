const { Playlist } = require('../models/config')
const { Music } = require('../models/config')


const playlistController = {
    async createPlaylist(playlistName, music_id, user_id) {
        try {
            const playlist = await Playlist.create({
                playlistName,
                music_id,
                user_id
            });
            console.log('Playlist created:', playlist);
            return playlist;
        } catch (error) {
            console.error('Error creating playlist:', error);
            throw error;
        }
    },

    async getAllPlaylists(user_id) {
        try {
            const playlists = await Playlist.findAll({
                where: { user_id },
                include: [{ model: Music, attributes: ['id', 'songName', 'artist'] }]
            });
            const playlistData = playlists.map(playlist => {
                return {
                    id: playlist.id,
                    playlistName: playlist.playlistName,
                    music_id: playlist.music_id,
                    createdAt: playlist.createdAt,
                    user_id: playlist.user_id,
                    Music: {
                        id: playlist.Music.id,
                        songName: playlist.Music.songName,
                        artist: playlist.Music.artist
                    }
                };
            });
            return playlistData;

        } catch (error) {
            console.error('Error fetching playlists:', error);
            throw error;
        }
    },

    async deletePlaylist(playlistId) {
        try {
            const result = await Playlist.destroy({
                where: { id: playlistId }
            });
            return result;
        } catch (error) {
            console.error('Error deleting playlist:', error);
            throw error;
        }
    },

    async updatePlaylist(playlistId, newPlaylistName) {
        try {
            const result = await Playlist.update(
                { playlistName: newPlaylistName },
                { where: { id: playlistId } }
            );
            return result;
        } catch (error) {
            console.error('Error updating playlist:', error);
            throw error;
        }
    },

    async getPlaylistById(playlistId) {
        try {
            const playlist = await Playlist.findOne({
                where: { id: playlistId },
                include: [{ model: Music, attributes: ['music_id', 'songName', 'artist'] }]
            });
            return playlist;
        } catch (error) {
            console.error('Error fetching playlist:', error);
            throw error;
        }
    }
}


module.exports = playlistController;