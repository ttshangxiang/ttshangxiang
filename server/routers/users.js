"use strict";

const router = require('koa-router')();
const userCtrl = require('../controllers/userCtrl');
const controller = require('./base');

controller(router, userCtrl);

module.exports = router;