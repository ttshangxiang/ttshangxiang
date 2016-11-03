require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import Card from './Card';
import 'isomorphic-fetch';
import promise from 'es6-promise';
promise.polyfill();

class AppComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: [] };
        this.render2 = this.render.bind(this);
    }

    componentDidMount () {
        fetch('/words')
        .then(response => response.json())
        .then(json => {
            this.state.data = json;
            this.render2();
        })
        .catch(err => console.log(err))
    }

    render() {
        var data = this.state.data,
            items = [];
        for (let i = 0; i < data.length; i++) {
            items.push(<Card key={data[i]._id} data={data[i]}></Card>)
        }
        return (
            <div className="index">
                {items}
            </div>
        );
    }
}

AppComponent.defaultProps = {
};

export default AppComponent;
