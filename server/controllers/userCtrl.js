"use strict";
const Users = require('../models/users');

module.exports = {
    suffix: 'User', //方法后缀
    getIndex: async(ctx, next) => {
        try {
            const list = await Users.list();
            ctx.body = list;
        } catch (err) {
            console.log(err);
            ctx.body = { status: false, message: '查询失败' };
        }
    },
    getUser: async(ctx, next) => {
        try {
            const user = await Users.select(ctx.params.key, ctx.params.value);
            ctx.body = user;
        } catch (err) {
            console.log(err);
            ctx.body = { status: false, message: '查询失败' };
        }
    },
    addUser: async(ctx, next) => {
        // ctx.query; //url参数
        // ctx.request.body; //body参数
        console.log(ctx.request.body);

        try {
            //查重
            let user = await Users.select('username', ctx.request.body.username);
            if (user) {
                ctx.body = { status: false, message: '用户名重复' };
                return;
            }
            await Users(ctx.request.body).save();
            ctx.body = { status: true };
        } catch (err) {
            console.log(err);
            ctx.body = { status: false, message: '保存失败' };
        }
    },
    updateUser: async(ctx, next) => {
        let id = ctx.request.body._id,
            param = ctx.request.body;
        delete param._id;
        // console.log(param, ctx.request.body._id);
        try {
            //查重
            let user = await Users.select('username', param.username);
            if (user && user._id != id) {
                ctx.body = { status: false, message: '用户名重复' };
                return;
            }
            await Users.findByIdAndUpdate(id, param);
            ctx.body = { status: true };
        } catch (err) {
            console.log(err);
            ctx.body = { status: false, message: '修改失败' };
        }
    },
    deleteUser: async(ctx, next) => {
        let id = ctx.params.key;
        try {
            await Users.findByIdAndRemove(id);
            ctx.body = { status: true };
        } catch (err) {
            console.log(err);
            ctx.body = { status: false, message: '删除失败' };
        }
    },
    queryUser: async(ctx, next) => {
        let query = ctx.query;
        for (let i in query) {
            if (i !== 'password' && i !== '_id') {
                query[i] = new RegExp(query[i]);
            }
        }
        try {
            const users = await Users.find(query);
            ctx.body = users;
        } catch (err) {
            console.log(err);
            ctx.body = { status: false, message: '查询失败' };
        }
    }
}
