"use strict";

const router = require('koa-router')();
const userCtrl = require('../controllers/userCtrl');

router.get('/', userCtrl.getIndex);

module.exports = router;