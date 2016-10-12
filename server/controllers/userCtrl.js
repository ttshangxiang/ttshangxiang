"use strict";
const user = require('../models/users');

module.exports = {
	getIndex: async (ctx, next) => {
		const list = await user.queryAll();
		ctx.body = JSON.stringify(list, null, 4);
	}
}