
import Words from '../models/words';

module.exports = {
    suffix: 'Words', //方法后缀
    getIndex: async(ctx, next) => {
        try {
            const list = await Words.find();
            ctx.body = list;
        } catch (err) {
            console.log(err);
            ctx.body = { status: false, message: '查询失败' };
        }
    },
    getWords: async(ctx, next) => {
        try {
            const word = await Words.select(ctx.params.key, ctx.params.value);
            ctx.body = word;
        } catch (err) {
            console.log(err);
            ctx.body = { status: false, message: '查询失败' };
        }
    },
    addWords: async(ctx, next) => {
        try {
            await Words(ctx.request.body).save();
            ctx.body = { status: true };
        } catch (err) {
            console.log(err);
            ctx.body = { status: false, message: '保存失败' };
        }
    },
    updateWords: async(ctx, next) => {
        let id = ctx.request.body._id,
            param = ctx.request.body;
        delete param._id;
        // console.log(param, ctx.request.body._id);
        try {
            await Words.findByIdAndUpdate(id, param);
            ctx.body = { status: true };
        } catch (err) {
            console.log(err);
            ctx.body = { status: false, message: '修改失败' };
        }
    },
    deleteWords: async(ctx, next) => {
        let id = ctx.params.key;
        try {
            await Words.findByIdAndRemove(id);
            ctx.body = { status: true };
        } catch (err) {
            console.log(err);
            ctx.body = { status: false, message: '删除失败' };
        }
    },
    queryWords: async(ctx, next) => {
        let query = ctx.query;
        for (let i in query) {
            if (i !== 'password' && i !== '_id') {
                query[i] = new RegExp(query[i]);
            }
        }
        try {
            const words = await Words.find(query);
            ctx.body = words;
        } catch (err) {
            console.log(err);
            ctx.body = { status: false, message: '查询失败' };
        }
    }
}