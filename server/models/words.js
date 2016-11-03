
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

let WordSchema = new Schema({
    username: String, //定义一个属性name，类型为String
    text: String,
    date: String,
    click: Number,
    img: String
}, { collection: 'words' });

WordSchema.statics = {
    list() {
        return this.find();
    },
    select(key, value) {
        if (!key || !value) {
            return;
        }
        let param = {};
        param[key] = value;
        return this.findOne(param);
    },
}

let Word = mongoose.model('Word', WordSchema);

module.exports = Word;