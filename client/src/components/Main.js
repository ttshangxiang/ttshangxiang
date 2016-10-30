require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import Card from './Card';

let img = require('../images/1293377518002363058.jpg');
let data = {
    img: img,
    text: '这张是前几天，周6，在回家路上拍的。',
    time: '2011-08-24',
    zan: 796
}

let img2 = require('../images/2891873910742182051.jpg');
let data2 = {
    img: img2,
    text: '专注，从LOFTER开始',
    time: '2011-08-25',
    zan: 359
}

class AppComponent extends React.Component {
    render() {
        return (
            <div className="index">
                <Card data={data}></Card>
                <Card data={data2}></Card>
            </div>
        );
    }
}

AppComponent.defaultProps = {
};

export default AppComponent;
