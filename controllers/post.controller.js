const { Op } = require('sequelize');
const { Music } = require('../models/config');

const PostController = {
    async selectAll(searchQuery) {
        try {
            const results = await Music.findAll({
                where: {
                    [Op.or]: [
                        { artist: { [Op.like]: `%${searchQuery}%` } },
                        { songName: { [Op.like]: `%${searchQuery}%` } }
                    ]
                }
            });
            return results;
        } catch (error) {
            console.error("검색 오류:", error);
            return [];
        }
    }
};

module.exports = PostController;
