
require('styles/Player.css');
import React from 'react';

class Player extends React.Component {

    render() {
        const bg_img = require('../images/music/niaoshouxihua.jpg');
        const head = require('../images/music/niaoshouxihua.jpg');
        return (
            <div className="s_player">
                <div className="btn-box">
                    <div className="play btn"></div>
                    <div className="like btn"></div>
                </div>
                <div className="info">
                    <img className="bg" src={bg_img} alt=""/>
                    <div className="content">
                        <img className="head" src={head} alt=""/>
                        <div className="song_title">鳥獣戯画</div>
                        <div className="song_artist">梶迫小道具店</div>
                    </div>
                    <div className="song-btn">
                        <div className="loop"></div>
                        <div className="voice"></div>
                        <div className="voice-num"></div>
                    </div>
                </div>
                <div className="btn-box">
                    <div className="prev btn"></div>
                    <div className="next btn"></div>
                </div>
            </div>
        );
    }
}

Player.defaultProps = {
};

export default Player;
