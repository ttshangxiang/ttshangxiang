"use strict";

const router = require('koa-router')();

let sleep = time => {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            resolve('ok');
        }, time);
    })
}

router
.get('/',async (ctx, next) => {
    ctx.body = 'hahh';
})
.get('user', '/users/:id', async (ctx, next) => {
    let a = await sleep(3000);
    console.log(a);
    ctx.body = ctx.params.id + '，你好';
})
.get('/admin', async (ctx, next) => {
    console.log(router.url('user', 3));
});


const mongoose = require('mongoose');

let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.on('open', ()=>{
	console.log('db open');

	let Schema = mongoose.Schema;

	let UserSchema = new Schema({
		name: String,   //定义一个属性name，类型为String
		username: String,
		password: Number
	});

	UserSchema.methods.printInfo = function() {
		console.log(this.name, this.username, this.password);
	}

	UserSchema.statics.printCount = function() {
		this.count({}, (err, count) => {
			if (err) {
				console.log(err);
			} else {
				console.log('user count='+ count);
			}
		})
	}

	let User = db.model('User',UserSchema);

	let nver = new User({name:'nver', username:'nver', password:123456});

	// nver.save((err, user) => {
	// 	if (err) {
	// 		console.log(err)
	// 	} else {
	// 		console.log('添加成功');
	// 	}
	// })
	User.find((err, users) => {
		if (err) {
			console.log(err);
		} else {
			console.log('查询成功');
			users.forEach((el, index) => {
				console.log(el, index);
			})
		}
	})

	
});
db.on('connecting', ()=>{
	console.log('db connecting...');
});
db.on('connected', ()=>{
	console.log('db connected');
});
db.on('disconnecting', ()=>{
	console.log('db disconnecting...');
});
db.on('disconnected', ()=>{
	console.log('db disconnected');
});
db.on('close', ()=>{
	console.log('db close');
});

mongoose.connect('mongodb://root:123456@ds011715.mlab.com:11715/ttshangxiang');

// 关闭的两种方式
// mongoose.connection.close(); 等同于 db.close();
// mongoose.disconnect();

// console.log(personEntity.name); //Krouky
// UserEntity.save(err => {
// 	if (err) {
// 		console.log('保存失败');
// 	} else {
// 		console.log('保存成功');
// 	}
// })

module.exports = router;