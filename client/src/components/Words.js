
import React from 'react';
import Card from './Card';

class AppComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: [] };
    }

    componentDidMount () {
        fetch('/words')
        .then(response => response.json())
        .then(json => {
            // 只有用 this.setState 才会调用 render
            this.setState({
                data: json
            });
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
            <div className="words">
                {items}
            </div>
        );
    }
}

AppComponent.defaultProps = {
};

export default AppComponent;
