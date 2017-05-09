let request = require('request');
let encode = require('../util/encode');


const header = {
    'Accept': '*/*',
    'Accept-Encoding': 'gzip,deflate,sdch',
    'Accept-Language': 'zh-CN,zh;q=0.8,gl;q=0.6,zh-TW;q=0.4',
    'Connection': 'keep-alive',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Host': 'music.163.com',
    'Referer': 'http://music.163.com/',
    'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.152 Safari/537.36'
}
let j = request.jar();
let cookie = request.cookie('appver=1.5.2');
let url = 'http://music.163.com';
j.setCookie(cookie, url);

function get (url, callback) {
    let options = {
        url: url,
        jar: j,
        headers: header,
        method: 'GET',
        gzip:true
    };
    request(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            callback(body);
        } else {
            callback(error, -1);
        }
    });
}

function post (url, param) {
    let options = {
        url: url,
        jar: j,
        headers: header,
        method: 'POST',
        gzip:true,
        body: encode(param)
    }
    return new Promise((resolve, reject) => {
        request(options, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                resolve(body);
            } else {
                resolve(error);
            }
        });
    });
}

module.exports = {
    //获取用户的歌单
    getUserlist (uid, offset=0, limit=20) {
        let param = {
            offset: offset,
            uid: uid,
            limit: limit
        };
        return post('http://music.163.com/weapi/user/playlist?csrf_token=', param);
    },
    //获取歌单详情
    getPlaylist (playlist_id) {
        let param = {
            id: playlist_id,
            offset: 0,
            total: true,
            limit: 1000,
            n: 1000
        }
        return post('http://music.163.com/weapi/v3/playlist/detail?csrf_token=', param);
    },
    //获取歌单详情2
    getPlaylist2 (playlist_id) {
        return new Promise((resolve, reject) => {
            get(`http://music.163.com/playlist?id=${playlist_id}`, function(body, code) {
                if (code == -1) {
                    resolve(body);
                } else {
                    let reg = /<textarea style="display:none;">(.*)<\/textarea>/;
                    let arr = body.match(reg);
                    let list = [];
                    if (arr[1]) {
                        list = JSON.parse(arr[1])
                    }
                    resolve(list);
                }
            });
        });
    },
    //获取单曲详情
    getSong (song_id) {
        return new Promise((resolve, reject) => {
            get(`http://music.163.com/song?id=${song_id}`, function(body, code) {
                if (code == -1) {
                    resolve(body);
                } else {
                    let reg = /<title>(.*)网易云音乐<\/title>/,
                        arr = body.match(reg);
                    let reg2 = /class="j-img" data-src="(.*)">/,
                        arr2 = body.match(reg2);
                    let reg3 = /<p class="des s-fc4">歌手：(.*)<\/p>/,
                        arr3 = body.match(reg3);
                    let reg4 = /<p class="des s-fc4">所属专辑：(.*)<\/p>/,
                        arr4 = body.match(reg4);
                    let obj = {};
                    if (arr[1]) {
                        obj.title = arr[1].split(' - ')[0];
                    }
                    if (arr2[1]) {
                        obj.img = arr2[1];
                    }
                    if (arr3[1]) {
                        let _arr3 = arr3[1].match(/<span title="(.*)"><a class="s-fc7" href="\/artist\?id=(.*)">(.*)<\/a><\/span>/)
                        if (_arr3[1]) {
                            obj.artist = _arr3[1];
                        }
                        if (_arr3[2]) {
                            obj.artist_id = _arr3[2];
                        }
                    }
                    if (arr4[1]) {
                        let _arr4 = arr4[1].match(/<a href="\/album\?id=(.*)" class="s-fc7">(.*)<\/a>/)
                        if (_arr4[1]) {
                            obj.album_id = _arr4[1];
                        }
                        if (_arr4[2]) {
                            obj.album = _arr4[2];
                        }
                    }
                    resolve(obj);
                }
            });
        });
    },
    //获取专辑详情
    getAlbum (album_id) {
        return new Promise((resolve, reject) => {
            get(`http://music.163.com/album?id=${album_id}`, function(body, code) {
                if (code == -1) {
                    resolve(body);
                } else {
                    let reg = /<textarea style="display:none;">(.*)<\/textarea>/;
                    let arr = body.match(reg);
                    let list = [];
                    if (arr[1]) {
                        list = JSON.parse(arr[1])
                    }
                    resolve(list);
                }
            });
        });
    },
    //获取歌曲
    getUrl (song_id) {
        let param = {
            ids: [song_id],
            br: 320000
        };
        return post('http://music.163.com/weapi/song/enhance/player/url?csrf_token=', param);
        // return post('http://t.ttshangxiang.com/weapi/song/enhance/player/url?csrf_token=', param);
        // return new Promise((resolve, reject) => {
        //      request('http://t.ttshangxiang.com/weapi/song/enhance/player/url?'+encode(param), function(error, response, body) {
        //         if (!error && response.statusCode == 200) {
        //             resolve(body);
        //         } else {
        //             resolve(error);
        //         }
        //     });
        // });
       
    },
    //获取歌词
    getLyric (song_id) {
        let param = {
            id:song_id,
            lv:0,
            tv:0
        };
        return post('http://music.163.com/weapi/song/lyric?csrf_token=', param);
    },
    //获取评论
    /*
    * type 专辑R_AL_3_ 歌曲R_SO_4_ 歌单A_PL_0_
    */
    getComment (song_id, type='R_SO_4_', offset=0, limit=20) {
        let param = {
            offset: offset,
            total: false,
            limit: limit
        };
        return post(`http://music.163.com/weapi/v1/resource/comments/${type}${song_id}/?csrf_token=`, param);
    },
    //搜索
    /*
    * type 单曲1，歌手100，专辑10，MV1004，歌词1006，歌单1000，主播电台1009，用户1002
    */
    cloudsearch (keywords, type=1, offset=0, limit=20) {
        let param = {
            s: keywords,
            offset: offset,
            limit: limit,
            total: false,
            type: type
        };
        return post('http://music.163.com/weapi/cloudsearch/get/web?csrf_token=', param);
    }
}