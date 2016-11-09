
import React from 'react';

class AppComponent extends React.Component {

    render() {
        const icon_play = require('../images/svg/play.svg');
        const icon_pause = require('../images/svg/pause.svg');
        const icon_prev = require('../images/svg/prev.svg');
        const icon_next = require('../images/svg/next.svg');
        return (
            <div className="index">
                <img src={icon_play} alt=""/>
                <img src={icon_pause} alt=""/>
                <img src={icon_prev} alt=""/>
                <img src={icon_next} alt=""/>
            </div>
        );
    }
}

AppComponent.defaultProps = {
};

export default AppComponent;
