import 'core-js/fn/object/assign';
import React from 'react';
import ReactDOM from 'react-dom';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';

import reducers from './reducers/reducers';

import Main from './components/Main';
import Home from './components/Home';
import Words from './components/Words';
import Music from './components/Music';

// Render the main component into the dom

import { Router, Route, IndexRoute, hashHistory } from 'react-router';

// Store
const store = createStore(reducers, applyMiddleware(thunkMiddleware));

ReactDOM.render(
    <Provider store = { store } >
        <Router history={hashHistory}>
            <Route path="/" component={Main}>
                <IndexRoute component={Home}/>
                <Route path="/words" component={Words}/>
                <Route path="/music" component={Music}/>
            </Route>
        </Router>
    </Provider>
, document.getElementById('app'));

// // React component
// class Counter extends Component {
//     render() {
//         const { value, onIncreaseClick } = this.props
//         return (
//             <div>
//                 <span> { value } </span>
//                 <button onClick = { onIncreaseClick } > Increase </button>
//             </div>
//         )
//     }
// }

// Counter.propTypes = {
//     value: PropTypes.number.isRequired,
//     onIncreaseClick: PropTypes.func.isRequired
// }

// // Action
// const increaseAction = { type: 'increase' }

// // Reducer
// function counter(state = { count: 0 }, action) {
//     const count = state.count
//     switch (action.type) {
//         case 'increase':
//             return { count: count + 1 }
//         default:
//             return state
//     }
// }

// // Store
// const store = createStore(counter)

// // Map Redux state to component props
// function mapStateToProps(state) {
//     return {
//         value: state.count
//     }
// }

// // Map Redux actions to component props
// function mapDispatchToProps(dispatch) {
//     return {
//         onIncreaseClick: () => dispatch(increaseAction)
//     }
// }

// // Connected Component
// const App = connect(
//     mapStateToProps,
//     mapDispatchToProps
// )(Counter)

// ReactDOM.render(
//     <Provider store = { store } >
//         <App/>
//     </Provider>,
//     document.getElementById('app')
// )
