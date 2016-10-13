"use strict";
const Users = require('../models/users');

module.exports = {
	model: 'User',
	getIndex: async (ctx, next) => {
		const list = await Users.list();
		ctx.body = list;
	},
	getUser: async (ctx, next) => {
		const user = await Users.select(ctx.params.key, ctx.params.value);
		ctx.body = user;
	},
	addUser: async (ctx, next) => {
		// ctx.query; //url参数
		// ctx.request.body; //body参数
		console.log(ctx.request.body);

		//查重
		let user = await Users.select('username',ctx.request.body.username);
		if (user) {
			ctx.body = {status: false, message: '用户名重复'};
			return;
		}
		try {
			await Users(ctx.request.body).save();
			ctx.body = {status: true};
		} catch (err) {
			console.log(err);
			ctx.body = {status: false, message: '保存失败'};
		}
	},
	updateUser: async (ctx, next) => {
		let id = ctx.request.body._id,
			param = ctx.request.body;
		delete param._id;
		// console.log(param, ctx.request.body._id);
		try {
			await Users.findByIdAndUpdate(id, param);
			ctx.body = {status: true};
		} catch (err) {
			console.log(err);
			ctx.body = {status: false, message: '修改失败'};
		}
	}
}