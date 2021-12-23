import React from 'react';
import ReactDOM from 'react-dom';
import TransitionGroupContext from './TransitionGroupContext';

export const UNMOUNTED = 'unmounted';
export const ENTERING = 'entering';
export const ENTERED = 'entered';
export const EXITING = 'exiting';
export const EXITED = 'exited';

class Transition extends React.Component {
    static contextType = TransitionGroupContext

    constructor(props) {
        super(props);
        const { in: _in } = props;
        let initialState;

        if (_in) {
            if (props.appear) {
                initialState = EXITED;
                this.appearStatus = ENTERING;
            } else {
                initialState = ENTERED;
            }
        } else {
            if (props.unmountOnExit) {
                initialState = UNMOUNTED;
            } else {
                initialState = EXITED;
            }
        }

        this.state = { status: initialState };
    }

    static getDerivedStateFromProps({ in: nextIn }, prevState) {
        if (nextIn && prevState.status === UNMOUNTED) {
            return { status: EXITED };
        }
        return null;
    }

    componentDidMount() {
        this.updateStatus(this.appearStatus, true);
    }

    componentWillUnmount() {
        this.cancelNextCallback();
    }

    componentDidUpdate(prevProps) {
        let nextStatus = null;
        if (prevProps !== this.props) {
            const { status } = this.state;

            if (this.props.in) {
                if (status !== ENTERING && status !== ENTERED) {
                    nextStatus = ENTERING;
                }
            } else {
                if (status === ENTERING || status === ENTERED) {
                    nextStatus = EXITING;
                }
            }
        }
        this.updateStatus(nextStatus, false);
    }

    cancelNextCallback() {
        if (this.nextCallback && this.nextCallback.cancel) {
            this.nextCallback.cancel();
        }
    }

    setNextCallback(callback) {
        let active = true;

        this.nextCallback = () => {
            if (active) {
                active = false;
                callback();
                this.nextCallback = null;
            }
        }

        this.nextCallback.cancel = () => {
            active = false;
            this.nextCallback = null;
        }

        return this.nextCallback;
    }

    safeSetState(status, callback) {
        callback = this.setNextCallback(callback);
        this.setState(status, callback);
    }

    onTransitionEnd(timeout, callback) {
        if (timeout) {
            callback = this.setNextCallback(callback);
            setTimeout(callback, timeout);
        }
    }

    performEnter(mounting) {
        const { timeout, onEnter, onEntering, onEntered } = this.props;
        const node = ReactDOM.findDOMNode(this);

        onEnter(node, mounting);

        // this.setState({
        //     status: ENTERING
        // }, () => {
        //     onEntering(node, mounting);
        //     setTimeout(() => {
        //         this.setState({
        //             status: ENTERED
        //         }, () => {
        //             onEntered(node, mounting);
        //         })
        //     }, timeout)
        // });

        // this.safeSetState({ status: ENTERING }, () => {
        //     onEntering(node, mounting);
        //     setTimeout(() => {
        //         this.safeSetState({ status: ENTERED }, () => {
        //             onEntered(node, mounting);
        //         })
        //     }, timeout);
        // })

        this.safeSetState({ status: ENTERING }, () => {
            onEntering(node, mounting);
            this.onTransitionEnd(timeout, () => {
                this.safeSetState({ status: ENTERED }, () => {
                    onEntered(node, mounting);
                })
            })
        })
    }

    performExit() {
        const { timeout, onExit, onExiting, onExited } = this.props;
        const node = ReactDOM.findDOMNode(this);

        onExit(node);

        this.safeSetState({ status: EXITING }, () => {
            onExiting(node);
            this.onTransitionEnd(timeout, () => {
                this.safeSetState({ status: EXITED }, () => {
                    onExited(node);
                })
            })
        })
    }

    updateStatus(nextStatus, mounting = false) {
        if (nextStatus !== null) {
            this.cancelNextCallback();

            if (nextStatus === ENTERING) {
                this.performEnter(mounting);
            } else {
                this.performExit();
            }
        } else if (this.props.unmountOnExit && this.state.status === EXITED) {
            this.setState({ status: UNMOUNTED });
        }
    }

    render() {
        const {
            children,
            nodeRef,
            in: _in,
            appear,
            timeout,
            onEnter,
            onEntering,
            onEntered,
            onExit,
            onExiting,
            onExited,
            unmountOnExit,
            ...childProps
        } = this.props;
        const { status } = this.state;

        if (status === UNMOUNTED) {
            return null;
        }

        return (
            <TransitionGroupContext.Provider value={null}>
                {typeof children === 'function'
                    ? children(status, childProps)
                    : React.cloneElement(React.Children.only(children), {
                        ref: nodeRef,
                        ...childProps
                    })}
            </TransitionGroupContext.Provider>
        )
    }
}

Transition.defaultProps = {
    in: false,
    timeout: 0,
    appear: true,
    onEnter: () => { },
    onEntering: () => { },
    onEntered: () => { },
    onExit: () => { },
    onExiting: () => { },
    onExited: () => { }
}

export default Transition;