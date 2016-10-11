const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    name: String,   //定义一个属性name，类型为String
    username: String,
    password: Number
}, {collection: 'users'});

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

let User = mongoose.model('User',UserSchema);

module.exports = User;

// let nver = new User({name:'nver', username:'nver', password:123456});

/*新增*/
// nver.save((err, user) => {
//     if (err) {
//         console.log(err)
//     } else {
//         console.log('添加成功');
//     }
// })

/*修改*/
// User.update({
//  id: nver._id
// }, {
//  $set: {
//      name: '女儿'
//  }
// }, err => {
//  if (err) {
//      console.log(err);
//      return;
//  }
//  console.log('修改成功');
// })

/*删除*/
// User.remove({
//  id: nver._id
// }, err => {
//  if (err) {
//      console.log(err);
//      return;
//  }
//  console.log('删除成功');
// })

/*查询*/
// User.find((err, users) => {
//  if (err) {
//      console.log(err);
//  } else {
//      console.log('查询成功');
//      users.forEach((el, index) => {
//          console.log(el, index);
//      })
//  }
// })