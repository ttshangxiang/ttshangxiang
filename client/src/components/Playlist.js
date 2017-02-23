
import React from 'react';

class Playlist extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
    }

    selectItem (index) {
        this.props.selectItem(index);
    }

    render() {
        let { list, select_id } = this.props;
        let dom = [];
        list.forEach((item, index) => {
            dom.push(<li key={index} className={'item ' + (index==select_id?'active':'')} onClick={()=>this.selectItem(index)}>{index}、{item.name} - {item.ar&&item.ar[0]&&item.ar[0].name}</li>)
        });
        return (
            <div className="playlist-page">
                <div className="playlist-box">
                    <ul className="playlist">{dom}</ul>
                </div>
            </div>
        );
    }
}

Playlist.defaultProps = {
};

export default Playlist;