
import React from 'react';

class Player extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            status: 1,
            loop: 1,
            preload: 'none', //不自动加载

            timeleft: '', //时间显示
            timeright: '',
            played: 0, //进度条
            loaded: 0, //已加载
            loading: true,

            select_id: null,
            pic_url: '',
            pic_url_blur: '',

            lyric: [],
            lyric_index: 0,
            centerPage: 'show-cd'
        };
    }

    componentDidMount() {
        this.audio = document.getElementById('audio');
        this.checkStatus();
    }

    componentWillReceiveProps(nextProps) {
        let {list, select_id} = nextProps;
        if (this.state.select_id == select_id) {
            return;
        }
        let newState = {
            select_id: select_id,
            loading: true,
            status: 1
        };
        if (list && list[select_id] && list[select_id].al && list[select_id].al) {
            let pic_url = list[select_id].al.picUrl+'?param=320y320',
                pic_url_blur = 'url("http://music.163.com/api/img/blur/'+list[select_id].al.pic+'")';
            newState.pic_url = pic_url;
            newState.pic_url_blur = pic_url_blur;
        }
        this.setState(newState);
        this.getUrl(select_id);
    }

    //秒钟变分钟
    _timeF(min) {
        return  (Math.floor(min / 60) + 100 + '').substr(1) + ':' +  (Math.floor(min % 60) + 100 + '').substr(1);
    }

    //事件
    checkStatus() {
        let audio = this.audio;
        audio.addEventListener('canplay', () => {
            audio.play();
        });
        audio.addEventListener('pause', () => {
            this.setState({ status: 2 });
        });
        audio.addEventListener('play', () => {
            this.setState({ status: 1 });
        });
        audio.addEventListener('playing', () => {
            this.setState({ loading: false });
        });
        audio.addEventListener('waiting', () => {
            this.setState({ loading: true });
        });
        audio.addEventListener('ended', () => {
            this.change('next');
        });
        let reg = /\d+\:\d{2}\.\d+/;
        let lyric_dom = document.getElementById('lyric-page');
        //进度条
        setInterval( () => {
            if (audio.duration && audio.currentTime) {
                let time = this._timeF(this.audio.currentTime);
                let obj = {
                    timeright: this._timeF(audio.duration),
                    timeleft: time,
                    played: audio.currentTime / audio.duration * 100 + '%',
                    loaded: audio.buffered.end(0) / audio.duration * 100 + '%'
                }

                let { lyric, lyric_index } = this.state;
                let dom = document.querySelector('#lyric-page .item.active');
                if (lyric[lyric_index] && (!reg.test(lyric[lyric_index][0]) || time > lyric[lyric_index][0])) {
                    dom && (lyric_dom.style.transform = 'translateY('+-1*(dom.offsetTop+dom.clientHeight)+'px)');
                    obj.lyric_index = lyric_index + 1;
                }
                if (lyric_index == 0) {
                    lyric_dom.style.transform = 'translateY(0px)';
                }
                this.setState(obj);

            } else {
                this.setState({
                    timeright: '00:00',
                    timeleft: '00:00',
                    played: 0,
                    loaded: 0
                });
            }
            
        }, 500);
    }

    renderProgress() {
        let {timeleft, timeright, loaded, played, loading} = this.state;
        return (
            <div className="player-progress">
                <div className="time left">{timeleft}</div>
                <div className="time right">{timeright}</div>
                <div className="bar">
                    <div className="loaded" style={{width: loaded}}></div>
                    <div className="played" style={{width: played}}>
                        <div className="point"><div className="loading" style={{display: (loading?'block':'none')}}></div></div>
                    </div>
                </div>
            </div>
        );
    }

    backToList () {
        this.props.goto('playlist_module');
    }

    //播放
    play() {
        if (this.state.status > 1) {
            this.audio.play();
            this.setState({ status: 1 });
        } else if (this.state.status == 1) {
            this.audio.pause();
            this.setState({ status: 2 });
        }
    }

    //切歌
    change(action) {
        let { select_id } = this.state;
        let { list } = this.props;
        let next_index = null;
        if (action == 'next') {
            if (this.state.loop == 3) {
                next_index = Math.floor( Math.random() * list.length );
            } else {
                next_index = select_id + 1;
                if (next_index >= list.length) {
                    next_index = 0;
                }
            }
        } else if (action == 'prev') {
            next_index = select_id - 1;
            if (next_index < 0) {
                next_index = list.length - 1;
            }
        }
        this.props.selectItem(next_index);
    }

    //获取歌曲播放url
    getUrl(index) {
        let select_item = this.props.list[index];
        if (!select_item) return;
        fetch('/api/neteast/url/'+select_item.id)
        .then(response => response.json())
        .then(json => {
            if (json.data&&json.data&&json.data[0]) {
                this.audio.autoplay = 'autoplay';
                this.audio.src = json.data[0].url;
            }
        });
        this.getLyric(index);
    }

    //获取歌词
    getLyric(index) {
        let select_item = this.props.list[index];
        if (!select_item) return;
        fetch('/api/neteast/lyric/'+select_item.id)
        .then(response => response.json())
        .then(json => {
            //歌词，翻译，歌词作者，翻译作者，纯音乐，暂无歌词
            let { lrc, tlyric, lyricUser, transUser, nolyric, uncollected } = json;
            let obj = {}; //结果
            if (nolyric) { //纯音乐 请欣赏
                obj =  {'纯音乐 请欣赏': {lyric: '纯音乐 请欣赏'}};
            }
            if (uncollected) {
                obj =  {'暂无歌词': {lyric: '暂无歌词'}};
            }
            if (lrc && lrc.lyric) { //歌词
                let reg = /\[.*\].*/g,
                    arr = lrc.lyric.match(reg);
                arr.forEach((item) => {
                    let result = item.match(/\[(.*)\](.*)/);
                    obj[result[1]] = {
                        time: result[1],
                        lyric: result[2] || ''
                    }
                });
            }
            if (tlyric && tlyric.lyric) { //歌词
                let reg = /\[.*\].*/g,
                    arr = tlyric.lyric.match(reg);
                arr.forEach((item) => {
                    let result = item.match(/\[(.*)\](.*)/);
                    obj[result[1]] && (obj[result[1]].tlyric = result[2] || '');
                });
            }
            if (lyricUser && lyricUser.nickname) {
                obj['歌词贡献者'] = {lyric: lyricUser.nickname };
            }
            if (transUser && transUser.nickname) {
                obj['翻译贡献者'] = {lyric: transUser.nickname };
            }
            this.setState({
                lyric: Object.entries(obj),
                lyric_index: 0
            });
        })
    }

    renderLyric () {
        let { lyric, lyric_index } = this.state;
        let dom = [];
        lyric.forEach((item, index) => {
            let [key, value] = item;
            let cls = 'item';
            if (index == lyric_index -1) {
                cls += ' active';
            }
            dom.push(
                <div key={key} className={cls}>
                    <div className="middle">{value.lyric}</div>
                    <div>{value.tlyric || ''}</div>
                </div>
            );
        });
        return dom;
    }

    //切换歌词
    changeCenter () {
        if (this.state.centerPage == 'show-cd') {
            this.setState({centerPage: 'show-lyric'});
        } else {
            this.setState({centerPage: 'show-cd'});
        }
    }

    render() {
        let { list } = this.props;
        let { select_id, pic_url, pic_url_blur } = this.state;
        let select_item = {al:{},ar:[{}]};
        if (select_id !== null) {
            select_item = list[select_id];
        }
        let progress_dom = this.renderProgress();
        let lrc_dom = this.renderLyric();
        let centerCls = this.state.status==1?' play ':'';
            centerCls += this.state.centerPage;
        return (
            <div className="player-page">
                <div className="player-bg" style={{backgroundImage: pic_url_blur}}>
                    <div className="player-bg2"></div>
                </div>
                <div className="player-header">
                    <div className="player-back" onClick={() => this.backToList()}></div>
                    <div className="player-title">
                        <div className="title">{select_item.name}</div>
                        <div className="artist">{select_item.ar[0].name}</div>
                    </div>
                </div>
                <div className={'player-center ' + centerCls} onClick={() => this.changeCenter()}>
                    <div className="cd-page">
                        <div className="play-line"></div>
                        <div className="player-bang"></div>
                        <div className="player-cd">
                            <img className="cd-img" src={pic_url} alt=""/>
                            <div className="cd-circle"></div>
                        </div>
                    </div>
                    <div className="lyric-page" id="lyric-page">
                        {lrc_dom}
                    </div>
                </div>
                <div className="player-footer">
                    <div className="player-option">
                        <div className="wrap">
                            <div className="item love"></div>
                            <div className="item download"></div>
                            <div className="item comment small">999+</div>
                            <div className="item more"></div>
                        </div>
                    </div>
                    {progress_dom}
                    <div className="player-controller">
                        <div className="random"></div>
                        <div className="list"></div>
                        <div className="wrap">
                            <div className="prev" onClick={() => this.change('prev')}></div>
                            <div className={'play ' + (this.state.status==1?'':'pause')} onClick={() => this.play()}></div>
                            <div className="next" onClick={() => this.change('next')}></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Player.defaultProps = {
};

export default Player;