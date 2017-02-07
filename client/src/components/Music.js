import '../styles/Music.css';
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
    return {
        list: state.music.list,
        music_index: state.music.playing
    }
}

const action = {
    play: (index) => {
        return {
            type: 'musics_play',
            index: index
        }
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(action, dispatch);
}

class Music extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    play (index) {
        this.props.play(index);
    }

    render() {
        const { list, music_index } = this.props;
        let list_dom = [];
        list.forEach((item, index) => {
            let active = '';
            if (music_index == index) {
                active = 'active';
            }
            list_dom.push(<li className={'item ' + active} key={index} onClick={ this.play.bind(this, index) }>{index} - {item.name}</li>);
        });
        return (
            <div className="musicList">
                {list_dom}
            </div>
        );
    }
}

Music.defaultProps = {
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Music);
