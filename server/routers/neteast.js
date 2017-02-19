
import koaRouter from 'koa-router';
import neteastCtrl from '../controllers/neteastCtrl';
import {controller} from './base';
const router = koaRouter();

controller(router, neteastCtrl);
router.get('/cloudsearch', neteastCtrl.cloudsearch);

module.exports = router;