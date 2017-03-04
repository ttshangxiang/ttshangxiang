
import React from 'react';

class Playlist extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
        this.first = false;
    }

    selectItem (index) {
        if (!this.first) { //uc bug，必须手动触发一次play
            document.getElementById('audio').play();
            this.first = true;
        }
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