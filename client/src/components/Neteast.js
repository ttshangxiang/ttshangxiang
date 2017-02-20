
import '../styles/Neteast.css'
import React from 'react';

//秒钟变分钟
function timeF(min) {
    return  (Math.floor(min / 60) + 100 + '').substr(1) + ':' +  (Math.floor(min % 60) + 100 + '').substr(1);
}

class Neteast extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            type: 'list',
            list: [],
            select_id: null,
            mp3_url: '',

            status: 3,
            loop: 1,
            loading: true,
            autoplay: false,
            preload: 'none', //不自动加载
            timeleft: '', //时间显示
            timeright: '',
            played: 0, //进度条
            loaded: 0 //已加载
        }
    }

    componentDidMount() {
        let id = '109717983';
        let arr = window.location.href.split('id=');
        if (arr[1]&&arr[1].length>0) {
            id = arr[1];
        }
        fetch('/api/neteast/playlist/'+id)
        .then(response => response.json())
        .then(json => {
            if (json && json.playlist && json.playlist.tracks) {
                this.setState({
                    list: json.playlist.tracks
                });
            }
        });
        this.checkStatus();
    }

    clickItem (index) {
        this.setState({
            select_id: index,
            type: 'item'
        });
        this.getUrl(index);
    }

    backToList () {
        this.setState({
            type: 'list'
        });
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
            this.setState({ loading: false });
        });
        audio.addEventListener('waiting', () => {
            this.setState({ loading: true });
        });
        audio.addEventListener('ended', () => {
            this.change('next');
        });
        //进度条
        setInterval( () => {
            if (audio.duration) {
                this.setState({
                    timeright: timeF(audio.duration),
                    timeleft: timeF(audio.currentTime),
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

    //播放
    play() {
        if (this.state.status > 1) {
            this.setState({ loading: true });
            this.refs.audio.play();
            this.setState({ status: 1 });
        } else if (this.state.status == 1) {
            this.refs.audio.pause();
            this.setState({ status: 2 });
        }
    }

    //切歌
    change(action) {
        const { list, select_id } = this.state;
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
        this.setState({
            select_id: next_index
        });
        this.getUrl(next_index);
    }

    getUrl(index) {
        if (index == null) {
            return;
        }
        let select_item = this.state.list[index];
        fetch('/api/neteast/url/'+select_item.id)
        .then(response => response.json())
        .then(json => {
            if (json.data&&json.data&&json.data[0]) {
                this.setState({
                    mp3_url: json.data[0].url
                });
                this.setState({ loading: true });
                this.refs.audio.play();
                this.setState({ status: 1 });
            }
        })
    }

    render() {
        let { list, type, select_id } = this.state;
        let dom = [];
        this.state.list.forEach((item, index) => {
            dom.push(<li key={index} className={'item ' + (index==select_id?'active':'')} onClick={this.clickItem.bind(this, index)}>{index}、{item.name} - {item.ar&&item.ar[0]&&item.ar[0].name}</li>)
        });
        let select_item = {al:{},ar:[{}]};
        if (select_id !== null) {
            select_item = list[select_id];
        }
        return (
            <div className={'neteast ' + type}>
                <div className="playlist-page">
                    <div className="playlist-box">
                        <ul className="playlist small">{dom}</ul>
                    </div>
                </div>
                <div className="player-page">
                    <audio src={ this.state.mp3_url } ref="audio" preload="none" autoPlay={ this.props.autoplay }></audio>
                    <div className="player-bg" style={{'backgroundImage': 'url('+select_item.al.picUrl+'?param=320y320)'}}>
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
                            <img className="cd-img" src={select_item.al.picUrl+'?param=320y320'} alt=""/>
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
                        <div className="player-progress">
                            <div className="time left">{this.state.timeleft}</div>
                            <div className="time right">{this.state.timeright}</div>
                            <div className="bar">
                                <div className="loaded" style={{width: this.state.loaded}}></div>
                                <div className="played" style={{width: this.state.played}}>
                                    <div className="point"><div className="loading" style={{display: (this.state.loading?'block':'none')}}></div></div>
                                </div>
                            </div>
                        </div>
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
            </div>
        );
    }
}

Neteast.defaultProps = {
};

export default Neteast;