
import React from 'react';

//进度条
class Progress extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timeleft: '', //时间显示
            timeright: '',
            played: 0, //进度条
            loaded: 0, //已加载
            loading: true
        }
    }

    componentDidMount() {
        this.checkStatus();
    }

    //秒钟变分钟
    _timeF(min) {
        return  (Math.floor(min / 60) + 100 + '').substr(1) + ':' +  (Math.floor(min % 60) + 100 + '').substr(1);
    }

    //事件
    checkStatus() {
        let audio = document.getElementById('audio');
        audio.addEventListener('pause', () => {
            this.props.setParentState({ status: 2 });
        });
        audio.addEventListener('play', () => {
            this.props.setParentState({ status: 1 });
        });
        audio.addEventListener('playing', () => {
            this.setState({ loading: false });
        });
        audio.addEventListener('waiting', () => {
            this.setState({ loading: true });
        });
        audio.addEventListener('ended', () => {
            this.props.change('next');
        });
        //进度条
        setInterval( () => {
            if (audio.duration) {
                this.setState({
                    timeright: this._timeF(audio.duration),
                    timeleft: this._timeF(audio.currentTime),
                    played: audio.currentTime / audio.duration * 100 + '%',
                    loaded: audio.buffered.end(0) / audio.duration * 100 + '%'
                });
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

    render() {
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
}

class Player extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            status: 3,
            loop: 1,
            autoplay: false,
            preload: 'none', //不自动加载

            select_id: null,
            mp3_url: '',
            pic_url: '',
            pic_url_blur: ''
        }
    }

    componentWillReceiveProps(nextProps) {
        let {list, select_id} = nextProps;
        let newState = {
            select_id: select_id
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

    backToList () {
        this.props.goto('playlist_module');
    }

    //播放
    play() {
        if (this.state.status > 1) {
            this.refs.audio.play();
            this.setState({ status: 1 });
        } else if (this.state.status == 1) {
            this.refs.audio.pause();
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
        this.getUrl(next_index);
    }

    getUrl(index) {
        if (index == null) {
            return;
        }
        let select_item = this.props.list[index];
        fetch('/api/neteast/url/'+select_item.id)
        .then(response => response.json())
        .then(json => {
            if (json.data&&json.data&&json.data[0]) {
                this.setState({
                    mp3_url: json.data[0].url
                });
                this.refs.audio.play();
                this.setState({ status: 1 });
            }
        })
    }

    setMyState (obj) {
        this.setState(obj);
    }

    render() {
        let { list } = this.props;
        let { select_id, pic_url, pic_url_blur } = this.state;
        let select_item = {al:{},ar:[{}]};
        if (select_id !== null) {
            select_item = list[select_id];
        }
        return (
            <div className="player-page">
                <audio id="audio" src={ this.state.mp3_url } ref="audio" preload="none"></audio>
                <div className="player-bg" style={{backgroundImage: pic_url_blur}}>
                    <div className="player-bg2"></div>
                </div>
                <div className="player-header">
                    <div className="player-back" onClick={this.backToList.bind(this)}></div>
                    <div className="player-title">
                        <div className="title">{select_item.name}</div>
                        <div className="artist">{select_item.ar[0].name}</div>
                    </div>
                </div>
                <div className={'player-center ' + (this.state.status==1?'play':'')}>
                    <div className="play-line"></div>
                    <div className="player-bang"></div>
                    <div className="player-cd">
                        <img className="cd-img" src={pic_url} alt=""/>
                        <div className="cd-circle"></div>
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
                    <Progress change={this.change.bind(this)} setParentState={this.setMyState.bind(this)}></Progress>
                    <div className="player-controller">
                        <div className="random"></div>
                        <div className="list"></div>
                        <div className="wrap">
                            <div className="prev" onClick={this.change.bind(this,'prev')}></div>
                            <div className={'play ' + (this.state.status==1?'':'pause')} onClick={this.play.bind(this)}></div>
                            <div className="next" onClick={this.change.bind(this,'next')}></div>
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