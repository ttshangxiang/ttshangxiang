
import koaRouter from 'koa-router';
import userCtrl from '../controllers/userCtrl';
import {resource, controller} from './base';
const router = koaRouter();

resource(router, userCtrl);

module.exports = router;