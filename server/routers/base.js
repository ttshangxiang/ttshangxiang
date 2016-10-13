"use strict";
/*
* controller通用方法
* 仿laravel
*/

let notFound = (ctx, next) => {
	ctx.body = 'notFound';
	ctx.status = 404;
	return;
}

module.exports =  (router, controller) => {
	router.get('/', controller.getIndex || notFound) //列表
	.get('/:key/:value', controller['get' + controller.model] || notFound)//精确查找单个
	.post('/', controller['add' + controller.model] || notFound)//新增
	.put('/', controller['update' + controller.model] || notFound)//修改
	.delete('/:key', controller['delete' + controller.model] || notFound)//删除
}