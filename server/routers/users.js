"use strict";

const router = require('koa-router')();
const userCtrl = require('../controllers/userCtrl');
const mongoose = require('mongoose');

router.use(async (ctx, next) => {
    if (mongoose.connection.readyState == 4) {
        ctx.status = 500;
        ctx.body = '数据库连接错误';
        return;
    }
    await next();
})

router.get('/', userCtrl.getIndex);

module.exports = router;