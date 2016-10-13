"use strict";

const router = require('koa-router')();
const users = require('./users');
const database = require('../config/db');

router.get('/',async (ctx, next) => {
    ctx.body = 'hahh';
});

router.use(async (ctx, next) => {
    // console.log('连接状态：'+database.db.readyState);
    if (database.db.readyState == 4) {
        ctx.status = 500;
        ctx.body = '数据库连接失败';
        return;
    }
    if (database.db.readyState == 0) {
    	try{
        	await database.create();
		} catch (err) {
			console.log(err);
			ctx.status = 500;
		    ctx.body = '数据库重连失败';
		    return;
		}
    }
    await next();
})

router.use('/users', users.routes(), users.allowedMethods());

module.exports = router;