
import Koa from 'koa';
import serve from 'koa-static';
import path from 'path';
import bodyParser from 'koa-bodyparser';
import router from './routers/index';
import db from './config/db';
const app = new Koa();

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
const server = app.listen(3000);

//socket.io
const io = require('socket.io').listen(server);

let history_msg = [];
let users = 0;

io.on('connection', function(socket){
  console.log('a user connected');
  users++;
  io.emit('users', users);
  socket.on('disconnect', function(){
    console.log('user disconnected');
    users--;
    io.emit('users', users);
  });
  socket.on('chat message', function(buffer){
    let msg = new Buffer(buffer).toString('utf-8');
    if (history_msg.length > 100) {
        history_msg.shift();
    }
    history_msg.push(buffer);
    console.log('message: ' + msg);
    io.emit('chat message', buffer);
  });
  socket.on('history', function(fn){
    console.log('在获取历史');
    fn(history_msg);
  });
});