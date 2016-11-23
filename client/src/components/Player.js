
require('styles/Player.css');
import React from 'react';
import { bindActionCreators} from 'redux';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
    return {
        music: state.music.playing
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
                    index: 0
                });
            })
            .catch(err => console.log(err))
        }
    },
    play: () => {
        return {
            type: 'musics_play',
            index: 0
        }
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(action, dispatch);
}

class Player extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            /*
            * -1: 未就绪
            *  0: 准备完毕
            *  1: 播放中
            *  2: 暂停
            *  3: 播放完毕
            */
            status: -1,
            /*
            * 0: 不循环
            * 1: 列表循环
            * 2: 单曲循环
            * 3: 随机
            */
            loop: 0,
            volume: 1 //音量
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

    componentDidMount () {
        this.props.load();
    }

    //播放
    play () {
        console.log('play');
    }

    //切歌
    change (action) {
        console.log(action);
    }

    //循环
    loop () {
        if (this.state.loop < 3) {
            this.setState({loop: ++this.state.loop });
        } else {
            this.setState({loop: 0 });
        }
    }

    //音量
    voice (event) {
        console.log(event);
    }

    render() {
        const { music } = this.props;
        return (
            <div className="s_player">
                <div className="btn-box">
                    <div className="play btn" onClick={ this.play }></div>
                    <div className="like btn"></div>
                </div>
                <div className="info">
                    <img className="bg" src={ music.img } alt=""/>
                    <div className="content">
                        <img className="head" src={ music.img } alt=""/>
                        <div className="song_title">{ music.name }</div>
                        <div className="song_artist">{ music.artist }</div>
                    </div>
                    <div className="song-btn">
                        <div className={ 'loop ' + this.props.loop_class[this.state.loop] } onClick={ this.loop.bind(this) }></div>
                        <div className="voice"></div>
                        <div className="voice-box" onClick={ this.voice.bind(this) }>
                            <div className="voice-num" style={{ width: this.state.volume * 100 + '%' }}></div>
                        </div>
                    </div>
                </div>
                <div className="btn-box">
                    <div className="next btn" onClick={ this.change.bind(this, 'next') }></div>
                    <div className="prev btn" onClick={ this.change.bind(this, 'prev') }></div>
                </div>
                <audio src= { music.path } autoPlay></audio>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Player);
