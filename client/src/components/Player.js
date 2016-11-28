require('styles/Player.css');
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
    return {
        list: state.music.list,
        music_index: state.music.playing
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
                    dispatch({
                        type: 'musics_play',
                        index: 1
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
    }
}

//获取元素的水平位置函数
function pageX(elem) {
    return elem.offsetParent ? elem.offsetLeft + pageX(elem.offsetParent) : elem.offsetLeft;
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(action, dispatch);
}

class Player extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false, //是否需要等待
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
            autoplay: false, //自动播放
            preload: 'none' //不自动加载
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
        this.refs.audio.addEventListener('pause', () => {
            this.setState({ status: 2 });
        });
        this.refs.audio.addEventListener('play', () => {
            this.setState({ status: 1 });
        });
        this.refs.audio.addEventListener('playing', () => {
            this.setState({ loading: false });
        });
        this.refs.audio.addEventListener('waiting', () => {
            this.setState({ loading: true });
        });
    }

    //播放
    play() {
        if (this.state.status > 1) {
            this.setState({ loading: true });
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
        this.setState({ autoplay: true, loading: true });
        const { list, music_index } = this.props;
        let next_index = null;
        if (action == 'next') {
            next_index = music_index + 1;
            if (next_index >= list.length) {
                next_index = 0;
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
        const { list, music_index } = this.props;
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
                        <div className={ this.state.loading ? 'loading' : '' }>
                        </div>
                    </a>
                    <a href="javascript:;" className="like btn">
                    </a>
                </div>
                <div className="info">
                    <img className="bg" src="/static/images/musics/bg.jpg" alt="" />
                    <div className="content">
                        <img className="head" src={ music.img } alt="" />
                        <div className="song_title"> { music.name }
                        </div>
                        <div className="song_artist"> { music.artist }
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
                </div>
                <div className="btn-box">
                    <a href="javascript:;" className="next btn" onClick={ this.change.bind(this, 'next') }>
                    </a>
                    <a href="javascript:;" className="prev btn" onClick={ this.change.bind(this, 'prev') }>
                    </a>
                </div>
                <audio src={ music.path } ref="audio" preload='none' autoPlay={ this.state.autoplay }></audio>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Player);