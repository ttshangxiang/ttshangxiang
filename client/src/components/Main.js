require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import 'isomorphic-fetch';
import promise from 'es6-promise';
import { Link, IndexLink } from 'react-router';
promise.polyfill();

import Player from './Player';

class AppComponent extends React.Component {
    render() {
        return (
            <div className="main">
                <ul role="nav" className="nav">
                    <li><IndexLink to="/" activeClassName="active">HOME</IndexLink></li>
                    <li><Link to="/words" activeClassName="active">WORDS</Link></li>
                    <li><Link to="/music" activeClassName="active">MUSIC</Link></li>
                    <li><Link to="/chat" activeClassName="active">CHAT</Link></li>
                </ul>
                {/*<Player></Player>*/}
                {this.props.children}
            </div>
        );
    }
}

AppComponent.defaultProps = {
};

export default AppComponent;
