"use strict";

const router = require('koa-router')();

let sleep = time => {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            resolve('ok');
        }, time);
    })
}

router
.get('/',async (ctx, next) => {
    ctx.body = 'hahh';
})
.get('user', '/users/:id', async (ctx, next) => {
    let a = await sleep(3000);
    console.log(a);
    ctx.body = ctx.params.id + '，你好';
})
.get('/admin', async (ctx, next) => {
    console.log(router.url('user', 3));
});

module.exports = router;