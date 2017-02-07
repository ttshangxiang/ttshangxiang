
import mongoose from 'mongoose';

let db = mongoose.connection;

db.on('error', () => {
    console.error.bind(console, 'connection error:')
});
db.on('open', () => {
    console.log('db open');
});
db.on('connecting', () => {
    console.log('db connecting...');
});
db.on('connected', () => {
    console.log('db connected');
});
db.on('disconnecting', () => {
    console.log('db disconnecting...');
});
db.on('disconnected', () => {
    console.log('db disconnected');
});
db.on('close', () => {
    console.log('db close');
});

let create = () => { //创建连接
    return new Promise((resolve, reject) => {
        try {
            db.once('error', (err) => {
                console.log(err);
                reject('error1');
            });
            db.once('open', () => {
                resolve();
            });
            db.once('disconnected', () => {
                reject('error2');
            });
            mongoose.connect('mongodb://admin:123456@45.76.208.181:27017/ttsx?authSource=admin');
        } catch (err) {
            reject('error3');
        }
    })
}

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

module.exports = {
    db,
    create
};