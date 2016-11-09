import { combineReducers } from 'redux';

const words = (state = { list: [] }, action) => {
    const { type, list } = action;
    switch (type) {
        case 'words_load':
            return { list: list };
        default:
            return state;
    }
}

const home = (state = 999, action) => {
    const { type } = action;
    switch (type) {
        case 'home_add':
            return state + 1;
        default:
            return state;
    }
}

const Reducer = combineReducers({
    words,
    home
})

export default Reducer;