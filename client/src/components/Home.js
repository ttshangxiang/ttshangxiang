
import React from 'react';
import Card from './card';

class AppComponent extends React.Component {

    render() {
        let data = {text: '哈哈哈', click: 555};
        return (
            <div className="index">
                <Card data={data}></Card>
            </div>
        );
    }
}

AppComponent.defaultProps = {
};

export default AppComponent;
