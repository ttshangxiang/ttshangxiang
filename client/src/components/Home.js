
import React from 'react';
import Card from './Card';
import { bindActionCreators} from 'redux';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
    return {
        count: state.home
    }
}

const action = {
    increase: () => {
        console.log('aaa');
        // return {type: 'home_add'}
        return (dispatch) => {
            dispatch({type: 'home_add'})
        }
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(action, dispatch);
}

class Home extends React.Component {

    render() {
        const {count, increase} = this.props;
        let data = {text: '哈哈哈',click: count};
        return (
            <div className="index" onClick={increase}>
                <Card data={data}></Card>
            </div>
        );
    }
}

Home.defaultProps = {
    haha: 'haha'
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);
