require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import 'isomorphic-fetch';
import promise from 'es6-promise';
import { Link, IndexLink } from 'react-router';
promise.polyfill();

class AppComponent extends React.Component {
    render() {
        return (
            <div className="main">
                <ul role="nav" className="nav">
                    <li><IndexLink to="/" activeClassName="active">HOME</IndexLink></li>
                    <li><Link to="/words" activeClassName="active">WORDS</Link></li>
                    <li><Link to="/music" activeClassName="active">MUSIC</Link></li>
                </ul>
                {this.props.children}
            </div>
        );
    }
}

AppComponent.defaultProps = {
};

export default AppComponent;
