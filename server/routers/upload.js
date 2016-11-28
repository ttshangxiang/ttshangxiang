import multer from 'koa-multer';

const upload = multer({ dest: 'uploads/' });


import koaRouter from 'koa-router';
const router = koaRouter();

router.post('/', upload.single('filename'));

module.exports = router;