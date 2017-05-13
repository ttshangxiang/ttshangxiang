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
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Subheader from 'material-ui/Subheader';
import Paper from 'material-ui/Paper';

let socket = io();

const mapStateToProps = (state) => {
    return {
        list: state.chat.list,
        mine: state.chat.mine,
        users: state.chat.users
    }
}

const action = {
    save: (obj) => {
        obj.type = 'chat_save';
        return obj;
    }
}

const unique = () => {
    return '_' + new Date().getTime() + Math.floor(Math.random()*100);
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(action, dispatch);
}

class Chat extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            postMsg: '',
            bottom_height: 48,
            open: false,

            nickname: '', //昵称
            nickname_err: '',
            users: 0
        }
    }

    componentDidMount () {
        
        let {mine} = this.props;
        if (!mine.id) {
            this.setState({open: true});
        }
        //历史消息
        socket.emit('history', (history, users) => {
            history = history.map((o) => {
                return JSON.parse(new Buffer(o).toString());
            });
            console.log(history);
            let {save} = this.props;
            save({list: history});
            this.forceUpdate();
        });

        socket.on('users', (users) => {
            this.setState({users});
        })

        //监听消息
        socket.on('chat message', (msg) => {
            msg = new Buffer(msg).toString();
            let {list, save} = this.props;
            list.push(JSON.parse(msg));
            save({list});
            this.forceUpdate();
        });

        //监听窗口变动
        this.refs.chatlistel.scrollTop = 9999;
        window.onresize = () => {
            this.refs.chatlistel.scrollTop = 9999;
        };
    }

    componentDidUpdate () {
        this.refs.chatlistel.scrollTop = 9999;
    }

    sendMsg () {
        if (this.state.postMsg==''){
            return;
        }
        let {mine} = this.props;
        socket.emit('chat message', new Buffer(JSON.stringify({msg:this.state.postMsg, nickname: mine.nickname, id: mine.id})));
        this.setState({postMsg: '', bottom_height: 48});
    }

    changeInput (e) {
        this.setState({
            postMsg: e.target.value
        });
    }

    setNickName (e) {
        this.setState({
            nickname: e.target.value,
            nickname_err: ''
        });
    }

    keyUp () {
        let height = this.refs.bottomel.clientHeight;
        if (height != this.state.bottom_height) {
            this.setState({bottom_height: height})
        }
    }

    handleOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        if (this.state.nickname != '') {
            this.setState({open: false, nickname_err: ''});
            this.props.save({mine: {
                nickname: this.state.nickname,
                id: unique()
            }});
        } else {
            this.setState({nickname_err: '需要一个名字哦'});
        }
    };

    render() {
        let {postMsg, bottom_height, nickname, nickname_err, users} = this.state;
        let {mine, list} = this.props;
        let dom = [];
        list.forEach((item, index) => {
            let nick = <div className="chat-nick">{item.nickname}</div>;
            let msg = <Paper zDepth={1} className="chat-box"><pre className="chat-text">{item.msg}</pre></Paper>;
            let _item = (<ListItem
                className="chat-item"
                primaryText={msg}
                secondaryText={nick}
                leftAvatar={<Avatar src="/static/images/kolage-128.jpg"></Avatar>}
                key={index}
                style={{overflow:'hidden'}}
            />)
            if (item.id == mine.id) {
                _item = (<ListItem
                className="chat-item mine"
                primaryText={msg}
                secondaryText={nick}
                rightAvatar={<Avatar src="/static/images/ztlz.jpg"></Avatar>}
                key={index}
                style={{overflow:'hidden'}}
            />)
            }
            dom.push(_item);
        });

        //弹出框
        const actions = [
        <FlatButton
            label="Ok"
            primary={true}
            keyboardFocused={true}
            onTouchTap={this.handleClose}
        />,
        ];
        return (
            <Card className="chat-page" style={{background:'#f9f9f9'}}>
                <Dialog
                    title="欢迎"
                    actions={actions}
                    modal={true}
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                    bodyStyle={{paddingBottom: 0, minHeight: '64px'}}
                >
                    <TextField hintText="昵称"
                        value={nickname}
                        onChange={e=>{this.setNickName(e)}}
                        fullWidth={true}
                        errorText={nickname_err}
                    />
                </Dialog>
                
                <Subheader>聊天室({users}人)</Subheader>
                <div className="chat-list-wrap" style={{bottom:bottom_height+16+'px'}} ref="chatlistel">
                    <List className="chat-list">
                        {dom}
                    </List>
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
                                onChange={e=>{this.changeInput(e)}}
                                onKeyUp={e=>{this.keyUp(e)}}
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
