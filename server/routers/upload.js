import multer from 'koa-multer';
import fs from 'fs';
import Musics from '../models/musics';
import 'core-js/fn/object/assign';

const upload = multer({ dest: './uploads/' });


import koaRouter from 'koa-router';
const router = koaRouter();

router.get('/', async(ctx, next) => {
    ctx.body = 'upload';
});

const randomFileName = () => {
    const now = new Date();
    return '' + now.getFullYear() + (now.getMonth() + 1) + now.getDate() + now.getHours() + now.getMinutes() + now.getSeconds() + Math.round(Math.random()*10000);
}

router.post('/', upload.fields([{ name: 'musicFile', maxCount: 1}, { name: 'musicPic', maxCount: 1} ]), async(ctx, next) => {
    try {
        const files = ctx.req.files,
        musicFile = files['musicFile'][0],
        musicPic = files['musicPic'][0];
        let random = randomFileName(),
            musicPath = '',
            musicPicPath = '';
        let suffix = musicFile.originalname.substr(musicFile.originalname.lastIndexOf('.'));
        musicPath = './client/static/musics/' + random + suffix;
        fs.renameSync(musicFile.path, musicPath);

        let suffix2 = musicPic.originalname.substr(musicPic.originalname.lastIndexOf('.'));
        musicPicPath = './client/static/images/musics/' + random + suffix2;
        fs.renameSync(musicPic.path, musicPicPath);

        let param = Object.assign({group: '', click: 1 }, ctx.req.body, { path: musicPath.substr(8), img: musicPicPath.substr(8) })
        await Musics(param).save();
        ctx.body = { status: true };
    } catch (err) {
        console.log(err);
        ctx.body = { status: false, message: '操作失败' };
    }
});

module.exports = router;