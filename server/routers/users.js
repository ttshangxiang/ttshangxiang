"use strict";

const router = require('koa-router')();
const userCtrl = require('../controllers/userCtrl');
const base = require('./base');

base.resource(router, userCtrl);

module.exports = router;