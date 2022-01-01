import React from 'react';
import { ENTERED, ENTERING, EXITING } from './Transition';
import TransitionGroupContext from './TransitionGroupContext';

const areChildrenDifferent = (oldChildren, newChildren) => {
    if (oldChildren === newChildren)
        return false;
    if (React.isValidElement(oldChildren)
        && React.isValidElement(newChildren)
        && oldChildren.key !== null
        && oldChildren.key === newChildren.key
    ) return false;
    return true;
}

const callHook = (element, name, cb) => {
    return (...args) => {
        element.props[name] && element.props[name](args);
        cb();
    }
}

const leaveRenders = {
    'out-in': ({ current, changeState }) => {
        return React.cloneElement(current, {
            in: false,
            onExited: callHook(current, 'onExited', () => {
                changeState(ENTERING, null);
            })
        })
    },

    'in-out': ({ current, children, changeState }) => {
        return [
            current,
            React.cloneElement(children, {
                in: true,
                onEntered: callHook(children, 'onEntered', () => {
                    changeState(ENTERING);
                })
            })
        ]
    }
}

const enterRenders = {
    'out-in': ({ children, changeState }) => {
        return React.cloneElement(children, {
            in: true,
            onEntered: callHook(children, 'onEntered', () => {
                changeState(ENTERED, React.cloneElement(children, { in: true }))
            })
        })
    },

    'in-out': ({ current, children, changeState }) => {
        return [
            React.cloneElement(current, {
                in: false,
                onExited: callHook(children, 'onExited', () => {
                    changeState(ENTERED, React.cloneElement(children, { in: true }));
                })
            }),
            React.cloneElement(children, { in: true })
        ]
    }
}

class SwitchTransition extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: ENTERED,
            current: null
        }

        this.appeared = false;
    }

    componentDidMount() {
        this.appeared = true;
    }

    static getDerivedStateFromProps(props, state) {
        if (!props.children) {
            return {
                current: null
            }
        }

        // 要保留current，否则会使用当前children覆盖current，导致前一个组件无法退出
        if (state.status === ENTERING && props.mode === 'in-out') {
            return {
                status: ENTERING
            }
        }

        if (state.current && areChildrenDifferent(state.current, props.children)) {
            return {
                status: EXITING
            }
        }

        // 实时保留children
        return {
            current: React.cloneElement(props.children, {
                in: true,
            }),
        };
    }

    changeState(status, current = this.state.current) {
        this.setState({
            status,
            current
        })
    }

    render() {
        const { mode, children } = this.props;
        const { status, current } = this.state;
        const data = { current, children, changeState: this.changeState.bind(this) };
        let component;

        switch (status) {
            case EXITING:
                component = leaveRenders[mode](data);
                break;
            case ENTERING:
                component = enterRenders[mode](data);
                break;
            case ENTERED:
                component = current;
                break;
            default:
                break;
        }

        return (
            <TransitionGroupContext.Provider value={{ isMounting: !this.appeared }}>
                {component}
            </TransitionGroupContext.Provider>
        )
    }
}

SwitchTransition.defaultProps = {
    mode: 'out-in'
}

export default SwitchTransition;