
import React from 'react';
import Card from './Card';
import { bindActionCreators} from 'redux';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
    return {
        list: state.words.list
    }
}

const action = {
    load: () => {
        return (dispatch, getState) => {
            if (getState().words.list.length > 0) {// 加载过就不加载了
                return;
            }
            fetch('/api/words')
            .then(response => response.json())
            .then(json => {
                dispatch({
                    type: 'words_load',
                    list: json
                });
            })
            .catch(err => console.log(err))
        }
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(action, dispatch);
}

class Words extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount () {
        this.props.load();
    }

    render() {
        const data = this.props.list,
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

Words.defaultProps = {
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Words);
