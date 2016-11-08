import { combineReducers } from 'redux';

const words = (state, action) => {
    const { type, payload } = action;
    switch (type) {
        case 'add_chat':
            return Object.assign({}, state, {
                chatLog: state.chatLog.concat(payload)
            });
        default:
            return state;
    }
}

const Reducer = combineReducers({
    words
})

export default Reducer;