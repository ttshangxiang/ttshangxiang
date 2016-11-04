import 'core-js/fn/object/assign';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/Main';
import Home from './components/Home';
import Words from './components/Words';
import Music from './components/Music';

// Render the main component into the dom

import { Router, Route, IndexRoute, hashHistory } from 'react-router';

ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Home}/>
            <Route path="/words" component={Words}/>
            <Route path="/music" component={Music}/>
        </Route>
    </Router>    
, document.getElementById('app'));
