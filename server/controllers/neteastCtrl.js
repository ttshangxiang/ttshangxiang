
import Neteast from '../models/neteast';

module.exports = {
    getIndex: async(ctx, next) => {
        try {
            const list = await Neteast.getUserlist(93828616);
            ctx.body = list;
        } catch (err) {
            console.log(err);
            ctx.body = { status: false, message: '查询失败' };
        }
    },
    getUserlist: async(ctx, next) => {
        try {
            let uid = ctx.params.itemId;
            if (!uid) {
                ctx.body = { status: false, message: '缺少ID' };
                return;
            }
            let {offset=0, limit=60} = ctx.query;
            const list = await Neteast.getUserlist(uid, offset, limit);
            ctx.body = list;
        } catch (err) {
            console.log(err);
            ctx.body = { status: false, message: '查询失败' };
        }
    },
    getPlaylist: async(ctx, next) => {
        try {
            let playlist_id = ctx.params.itemId;
            if (!playlist_id) {
                ctx.body = { status: false, message: '缺少ID' };
                return;
            }
            const list = await Neteast.getPlaylist(playlist_id);
            ctx.body = list;
        } catch (err) {
            console.log(err);
            ctx.body = { status: false, message: '查询失败' };
        }
    },
    getPlaylist2: async(ctx, next) => {
        try {
            let playlist_id = ctx.params.itemId;
            if (!playlist_id) {
                ctx.body = { status: false, message: '缺少ID' };
                return;
            }
            const list = await Neteast.getPlaylist2(playlist_id);
            ctx.body = list;
        } catch (err) {
            console.log(err);
            ctx.body = { status: false, message: '查询失败' };
        }
    },
    getAlbum: async(ctx, next) => {
        try {
            let album_id = ctx.params.itemId;
            console.log(album_id);
            if (!album_id) {
                ctx.body = { status: false, message: '缺少ID' };
                return;
            }
            const list = await Neteast.getAlbum(album_id);
            ctx.body = list;
        } catch (err) {
            console.log(err);
            ctx.body = { status: false, message: '查询失败' };
        }
    },
    getUrl: async(ctx, next) => {
        try {
            let song_id = ctx.params.itemId;
            if (!song_id) {
                ctx.body = { status: false, message: '缺少ID' };
                return;
            }
            const list = await Neteast.getUrl(song_id);
            ctx.body = list;
        } catch (err) {
            console.log(err);
            ctx.body = { status: false, message: '查询失败' };
        }
    },
    getLyric: async(ctx, next) => {
        try {
            let song_id = ctx.params.itemId;
            if (!song_id) {
                ctx.body = { status: false, message: '缺少ID' };
                return;
            }
            const list = await Neteast.getLyric(song_id);
            ctx.body = list;
        } catch (err) {
            console.log(err);
            ctx.body = { status: false, message: '查询失败' };
        }
    },
    getComment: async(ctx, next) => {
        try {
            let song_id = ctx.params.itemId;
            if (!song_id) {
                ctx.body = { status: false, message: '缺少ID' };
                return;
            }
            let {type='R_SO_4_', offset=0, limit=20} = ctx.query;
            const list = await Neteast.getComment(song_id, type, offset, limit);
            ctx.body = list;
        } catch (err) {
            console.log(err);
            ctx.body = { status: false, message: '查询失败' };
        }
    },
    cloudsearch: async(ctx, next) => {
        try {
            let {keywords, type=1, offset=0, limit=20} = ctx.query;
            const list = await Neteast.cloudsearch(keywords, type, offset, limit);
            ctx.body = list;
        } catch (err) {
            console.log(err);
            ctx.body = { status: false, message: '查询失败' };
        }
    }
}