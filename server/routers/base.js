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
	.get('/:key/:value', controller['get' + controller.suffix] || notFound)//精确查找单个
	.post('/', controller['add' + controller.suffix] || notFound)//新增
	.put('/', controller['update' + controller.suffix] || notFound)//修改
	.delete('/:key', controller['delete' + controller.suffix] || notFound)//删除
	.get('/query', controller['query' + controller.suffix] || notFound)//模糊查询
}