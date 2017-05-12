
import React from 'react';
import { bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

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
            <Card>
                <CardHeader
                    title="URL Avatar"
                    subtitle="Subtitle"
                    avatar="/static/images/jsa-128.jpg"
                />
                <CardMedia
                    overlay={<CardTitle title="Overlay title" subtitle="Overlay subtitle" />}
                >
                    <img src="/static/images/nature-600-337.jpg" />
                </CardMedia>
                <CardTitle title="Card title" subtitle="Card subtitle" />
                <CardText>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
                    Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
                    Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
                </CardText>
                <CardActions>
                    <FlatButton label="Action1" />
                    <FlatButton label="Action2" />
                </CardActions>
            </Card>
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
