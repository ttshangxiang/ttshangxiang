
require('styles/Player.css');
import React from 'react';

class Player extends React.Component {

    render() {
        const cuseqi = require('../images/words/1293377518002363058.jpg');
        // const head = require('../images/yeoman.png');
        return (
            <div className="s_player">
                <div className="btn-box">
                    <div className="play btn"></div>
                    <div className="like btn"></div>
                </div>
                <div className="info">
                    <img className="bg" src={cuseqi} alt=""/>
                    <div className="content">
                        <img className="head" src={cuseqi} alt=""/>
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
