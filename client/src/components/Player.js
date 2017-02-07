require('styles/Player.css');
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
    return {
        list: state.music.list,
        music_index: state.music.playing,
        autoplay: state.music.autoplay, //自动播放
        loading: state.music.loading //是否需要等待
    }
}

const action = {
    load: () => {
        return (dispatch) => {
            fetch('/api/musics')
                .then(response => response.json())
                .then(json => {
                    dispatch({
                        type: 'musics_load',
                        list: json
                    });
                })
                .catch(err => console.log(err))
        }
    },
    play: (index) => {
        return {
            type: 'musics_play',
            index: index
        }
    },
    setLoading: (loading) => {
        return {
            type: 'musics_loading',
            loading: loading
        }
    }
}

//获取元素的水平位置函数
function pageX(elem) {
    return elem.offsetParent ? elem.offsetLeft + pageX(elem.offsetParent) : elem.offsetLeft;
}

//秒钟变分钟
function timeF(min) {
    return  (Math.floor(min / 60) + 100 + '').substr(1) + ':' +  (Math.floor(min % 60) + 100 + '').substr(1);
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(action, dispatch);
}

class Player extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            /*
             *  1: 播放中
             *  2: 暂停
             *  3: 播放完毕
             */
            status: 3,
            /*
             * 0: 不循环
             * 1: 列表循环
             * 2: 单曲循环
             * 3: 随机
             */
            loop: 0,
            volume: 1, //音量
            quiet: false,
            preload: 'none', //不自动加载
            times: '', //时间显示
            played: 0, //进度条
            loaded: 0 //已加载
        }
    }

    static defaultProps = {
        loop_class: {
            '0': 'noloop',
            '1': '',
            '2': 'loop_one',
            '3': 'random'
        }
    };

    componentDidMount() {
        this.props.load();
        this.checkStatus();
    }

    //事件
    checkStatus() {
        let audio = this.refs.audio;
        audio.addEventListener('pause', () => {
            this.setState({ status: 2 });
        });
        audio.addEventListener('play', () => {
            this.setState({ status: 1 });
        });
        audio.addEventListener('playing', () => {
            this.props.setLoading(false);
        });
        audio.addEventListener('waiting', () => {
            this.props.setLoading(true);
        });
        audio.addEventListener('ended', () => {
            this.change('next');
        });
        //进度条
        setInterval( () => {
            if (audio.duration) {
                this.setState({
                    times: timeF(audio.duration) + '/' + timeF(audio.currentTime),
                    played: audio.currentTime / audio.duration * 100 + '%',
                    loaded: audio.buffered.end(0) / audio.duration * 100 + '%'
                });
            } else {
                this.setState({
                    times: '',
                    played: 0,
                    loaded: 0
                });
            }
            
        }, 500);
    }

    //播放
    play() {
        if (this.state.status > 1) {
            this.props.setLoading(true);
            this.refs.audio.play();
            this.setState({ status: 1 });
        }
        if (this.state.status == 1) {
            this.refs.audio.pause();
            this.setState({ status: 2 });
        }
    }

    //切歌
    change(action) {
        const { list, music_index } = this.props;
        let next_index = null;
        if (action == 'next') {
            if (this.state.loop == 3) {
                next_index = Math.floor( Math.random() * this.props.list.length );
            } else {
                next_index = music_index + 1;
                if (next_index >= list.length) {
                    next_index = 0;
                }
            }
        } else if (action == 'prev') {
            next_index = music_index - 1;
            if (next_index < 0) {
                next_index = list.length - 1;
            }
        }
        this.props.play(next_index);
    }

    //循环
    loop() {
        if (this.state.loop < 3) {
            this.setState({ loop: ++this.state.loop });
        } else {
            this.setState({ loop: 0 });
        }
    }

    //静音
    quiet() {
        this.refs.audio.muted = !this.state.quiet;
        this.setState({ quiet: !this.state.quiet })
    }

    //音量
    voice(event) {
        if (this.state.quiet) {
            return;
        }
        const dom = this.refs.voiceBox;
        let value = (event.pageX - pageX(dom)) / dom.clientWidth;
        this.refs.audio.volume = value * value;
        this.setState({ volume: value });
    }

    render() {
        const { list, music_index, loading } = this.props;
        const music = list[music_index] || {};
        let play_class = 'play btn ';
        if (this.state.status == -1) {
            play_class += 'loading';
        } else if (this.state.status == 1) {
            play_class += 'pause';
        }
        let voice_style = {
            display: this.state.quiet ? 'none' : 'block',
            width: this.state.volume * 100 + '%'
        };
        return (
            <div className="s_player">
                <div className="btn-box">
                    <a href="javascript:;" className={ play_class } onClick={ this.play.bind(this) }>
                        <div className={ loading ? 'loading' : '' }>
                        </div>
                    </a>
                    <a href="javascript:;" className="like btn">
                    </a>
                </div>
                <div className="info">
                    <img className="bg" src="/static/images/musics/bg.jpg" alt="" />
                    <div className="content">
                        <img className="head" src="/static/images/musics/default.svg" alt="" />
                        <div className="song_title"> { music.name }
                        </div>
                        <div className="song_artist"> { music.singer }
                        </div>
                    </div>
                    <div className="song-btn">
                        <div className={ 'loop ' + this.props.loop_class[this.state.loop] } onClick={ this.loop.bind(this) }>
                        </div>
                        <div className={ 'voice ' + (this.state.quiet ? 'voice_no' : '') } onClick={ this.quiet.bind(this) }>
                        </div>
                        <div className="voice-box" ref="voiceBox" onClick={ this.voice.bind(this) }>
                            <div className="voice-num" style={ voice_style }>
                            </div>
                        </div>
                    </div>
                    <div className="times">{ this.state.times }</div>
                    <div className="loaded" style={{ width: this.state.loaded }}></div>
                    <div className="played" style={{ width: this.state.played }}></div>
                </div>
                <div className="btn-box">
                    <a href="javascript:;" className="next btn" onClick={ this.change.bind(this, 'next') }>
                    </a>
                    <a href="javascript:;" className="prev btn" onClick={ this.change.bind(this, 'prev') }>
                    </a>
                </div>
                <audio src={ 'http://t.ttshangxiang.com/'+music.url } ref="audio" preload="none" autoPlay={ this.props.autoplay } loop={ this.state.loop == 2 }></audio>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Player);