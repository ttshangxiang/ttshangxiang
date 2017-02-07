
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

let MusicSchema = new Schema({
    name: String,
    singer: String,
    group: String,
    url: String,
    about: String
}, { collection: 'music_collection' });

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