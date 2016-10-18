"use strict";
const Koa = require('koa');
const serve = require('koa-static');
const path = require('path');
const bodyParser = require('koa-bodyparser');
const app = new Koa();
const router = require('./routers/index');
const db = require('./config/db');

app.use(bodyParser());

let init = async() => {
    try {
        await db.create();
    } catch (err) {
        console.log(err);
    }
}
init(); //连接

app.use(async(ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

app.use(serve(path.join(__dirname, '../client'))); //静态文件目录

app.use(router.routes())
    .use(router.allowedMethods());

console.log('listen 3000...');
app.listen(3000);