
import koaRouter from 'koa-router';
import users from './users';
import words from './words';
import database from '../config/db';

const router = koaRouter();

router.get('/', async(ctx, next) => {
    ctx.body = 'hahh';
});

router.use(async(ctx, next) => {
    // console.log('连接状态：'+database.db.readyState);
    if (database.db.readyState == 4) {
        ctx.status = 500;
        ctx.body = '数据库连接失败';
        return;
    }
    if (database.db.readyState == 0) {
        try {
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

const child = koaRouter();

child.use('/users', users.routes(), users.allowedMethods());
child.use('/words', words.routes(), words.allowedMethods());

//加一层api
router.use('/api', child.routes(), child.allowedMethods())

module.exports = router;