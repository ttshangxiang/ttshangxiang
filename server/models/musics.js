
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

let MusicSchema = new Schema({
    name: String,
    artist: String,
    group: String,
    click: Number,
    img: String,
    path: String
}, { collection: 'musics' });

MusicSchema.statics = {
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

let Word = mongoose.model('MusicSchema', MusicSchema);

module.exports = Word;