
import koaRouter from 'koa-router';
import wordCtrl from '../controllers/musicCtrl';
import {resource} from './base';
const router = koaRouter();

resource(router, wordCtrl);

module.exports = router;