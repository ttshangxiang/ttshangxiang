import 'core-js/fn/object/assign';
import React from 'react';
import ReactDOM from 'react-dom';
import './styles/Neteast.css'

ReactDOM.render(
    <div className="player-page">
        <div className="player-header">
            <div className="player-back"></div>
            <div className="player-title">
                <div className="title">寒霜千年</div>
                <div className="artist">双笙</div>
            </div>
        </div>
        <div className="player-center">
            <div className="player-bang">杆子</div>
            <div className="player-cd">
                <div>图</div>
            </div>
        </div>
        <div className="player-footer">
            <div className="player-option">
                <div>爱心</div>
                <div>下载</div>
                <div>评论</div>
                <div>更多</div>
            </div>
            <div className="player-progress">进度条</div>
            <div className="player-controller">
                <div>随机</div>
                <div>
                    <div>上一首</div>
                    <div>播放</div>
                    <div>下一首</div>
                </div>
                <div>列表</div>
            </div>
        </div>
    </div>
, document.getElementById('app'));