"use strict";

const router = require('koa-router')();
const users = require('./users');


router.get('/',async (ctx, next) => {
    ctx.body = 'hahh';
});

router.use('/users', users.routes(), users.allowedMethods());

module.exports = router;