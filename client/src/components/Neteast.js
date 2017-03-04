
import '../styles/Neteast.css'
import React from 'react';
import Playlist from './Playlist';
import Player from './Player2';

import 'core-js/fn/object/assign';
import 'isomorphic-fetch';
import promise from 'es6-promise';
promise.polyfill();

class Neteast extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            type: 'playlist_module',
            list: [],
            select_id: null
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
    }

    selectItem(index) {
        this.setState({
            select_id: index
        });
        this.setState({
            type: 'player_module'
        });
    }

    goto(type) {
        this.setState({
            type: type
        });
    }

    render() {
        let { type, list, select_id} = this.state;
        return (
            <div className={'neteast ' + type}>
                <Playlist list={list} select_id={select_id} selectItem={(index) =>this.selectItem(index)}></Playlist>
                <Player list={list} select_id={select_id}  selectItem={(index) =>this.selectItem(index)} goto={(type) => this.goto(type)}></Player>
                <audio id="audio" preload="none"></audio>
            </div>
        );
    }
}

Neteast.defaultProps = {
};

export default Neteast;