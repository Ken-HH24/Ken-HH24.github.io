import React from 'react';
import Provider from './components/Provider';
import createStore from '../redux/createStore';
import connect from './connect/Connect';

const reducer = (state, action) => {
    const newState = JSON.parse(JSON.stringify(state));
    switch (action.type) {
        case 'ADD':
            newState.count++;
            return newState;
        default:
            return state;
    }
}

const store = createStore(reducer, { count: 1 });

const SubComponent = (props) => {
    const { count, addCount } = props;
    return (
        <div>
            <h1>{count}</h1>
            <div onClick={() => { addCount() }}>add count</div>
            <SecondeSubComponentConnected />
        </div>
    )
}

const SecondeSubComponent = (props) => {
    const { count, addCount } = props;
    return (
        <div>
            <h1>seconde: {count}</h1>
            <div onClick={() => { addCount() }}>add count</div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        count: state.count
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        addCount() {
            dispatch({
                type: 'ADD'
            })
        }
    }
}

const SubComponentConnected = connect(mapStateToProps, mapDispatchToProps)(SubComponent);
const SecondeSubComponentConnected = connect(mapStateToProps, mapDispatchToProps)(SecondeSubComponent);

const ReactReduxDemo = () => {
    return (
        <Provider store={store}>
            <SubComponentConnected />
        </Provider>
    )
}

export default ReactReduxDemo;