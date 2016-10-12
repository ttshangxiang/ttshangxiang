"use strict";
const mongoose = require('mongoose');

let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.on('open', ()=>{
    console.log('db open');    
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
//  if (err) {
//      console.log('保存失败');
//  } else {
//      console.log('保存成功');
//  }
// })

module.exports = db;