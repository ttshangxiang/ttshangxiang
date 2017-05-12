import '../styles/Chat.css';
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import {Card, CardActions} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

let socket = io();

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

class Chat extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            postMsg: '',
            msgList: [],
            bottom_height: 48
        }

        socket.on('chat message', (msg) => {
            msg = new Buffer(msg).toString();
            let {msgList} = this.state;
            msgList.push(JSON.parse(msg));
            this.setState({msgList});
        });
    }

    componentDidUpdate () {
        this.refs.chatlistel.scrollTop = 9999;
    }

    sendMsg () {
        if (this.state.postMsg==''){
            return;
        }
        socket.emit('chat message', new Buffer(JSON.stringify({msg:this.state.postMsg, id: socket.id})));
        this.setState({postMsg: '', bottom_height: 48});
    }

    changeInput (e) {
        this.setState({
            postMsg: e.target.value,
            bottom_height: this.refs.bottomel.clientHeight
        });
    }

    render() {
        let {postMsg, msgList, bottom_height} = this.state;
        let dom = [];
        msgList.forEach((item, index) => {
            let _item = (<ListItem
                primaryText={item.msg}
                leftAvatar={<Avatar src="/static/images/jsa-128.jpg"></Avatar>}
                key={index}
            />)
            if (item.id == socket.id) {
                _item = (<ListItem
                primaryText={item.msg}
                rightAvatar={<Avatar src="/static/images/kolage-128.jpg"></Avatar>}
                key={index}
            />)
            }
            dom.push(_item);
        })
        return (
            <Card className="chat-page" style={{paddingBottom:bottom_height+16+'px'}}>
                <div className="chat-list-wrap" ref="chatlistel">
                    <List className="chat-list">{dom}</List>
                </div>
                <div className="chat-bottom">
                    <CardActions>
                        <RaisedButton
                            label="发送"
                            primary={true}
                            onClick={() => this.sendMsg()}
                            style={{float:'right',marginTop:'6px'}}
                        />
                        <div style={{marginRight: '110px', marginLeft:'6px'}} ref="bottomel">
                            <TextField hintText="请输入"
                                value={postMsg}
                                onChange={(e)=>{this.changeInput(e)}}
                                multiLine={true}
                                fullWidth={true}
                                rows={1}
                                rowsMax={4}
                            />
                        </div>
                    </CardActions>
                </div>
            </Card>
        );
    }
}

Chat.defaultProps = {
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Chat);
