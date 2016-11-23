
import Musics from '../models/musics';

module.exports = {
    suffix: 'Musics', //方法后缀
    getIndex: async(ctx, next) => {
        try {
            const list = await Musics.find();
            ctx.body = list;
        } catch (err) {
            console.log(err);
            ctx.body = { status: false, message: '查询失败' };
        }
    },
    getMusics: async(ctx, next) => {
        try {
            const music = await Musics.select(ctx.params.key, ctx.params.value);
            ctx.body = music;
        } catch (err) {
            console.log(err);
            ctx.body = { status: false, message: '查询失败' };
        }
    },
    addMusics: async(ctx, next) => {
        try {
            await Musics(ctx.request.body).save();
            ctx.body = { status: true };
        } catch (err) {
            console.log(err);
            ctx.body = { status: false, message: '保存失败' };
        }
    },
    updateMusics: async(ctx, next) => {
        let id = ctx.request.body._id,
            param = ctx.request.body;
        delete param._id;
        // console.log(param, ctx.request.body._id);
        try {
            await Musics.findByIdAndUpdate(id, param);
            ctx.body = { status: true };
        } catch (err) {
            console.log(err);
            ctx.body = { status: false, message: '修改失败' };
        }
    },
    deleteMusics: async(ctx, next) => {
        let id = ctx.params.key;
        try {
            await Musics.findByIdAndRemove(id);
            ctx.body = { status: true };
        } catch (err) {
            console.log(err);
            ctx.body = { status: false, message: '删除失败' };
        }
    },
    queryMusics: async(ctx, next) => {
        let query = ctx.query;
        for (let i in query) {
            if (i !== 'password' && i !== '_id') {
                query[i] = new RegExp(query[i]);
            }
        }
        try {
            const musics = await Musics.find(query);
            ctx.body = musics;
        } catch (err) {
            console.log(err);
            ctx.body = { status: false, message: '查询失败' };
        }
    }
}