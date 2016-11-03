
import React from 'react';
require('styles/Card.css');

class AppComponent extends React.Component {
    render() {
        let data = this.props.data;
        return (
            <div className="card">
                <div className="content">
                    <div className="warp">
                        <div className="img">
                            <a href="javascript:;">
                                <span className="f-trans piccover">&nbsp;</span>
                                <img className="f-trans" src={data.img} alt="" />
                            </a>
                        </div>
                    </div>
                    <div className="text">
                        <p>{data.text}</p>
                    </div>
                </div>
                <div className="f-clear otherinfo">
                    <a href="#" className="time">{data.date}</a>
                    <a href="#" className="f-icon hot">{data.click}</a>
                </div>
            </div>
        );
    }
}

AppComponent.defaultProps = {
};

export default AppComponent;
