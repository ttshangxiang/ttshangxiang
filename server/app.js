
const Koa = require('koa');
const serve = require('koa-static');
const path = require('path');
const app = new Koa();
const router = require('./router/index');

app.use(async (ctx, next) => {
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