import React from 'react';
import Transition from './Transition';

import addOneClass from 'dom-helpers/addClass'
import removeOneClass from 'dom-helpers/removeClass'

function addClass(node, classes) {
    node && classes && classes.forEach(c => { addOneClass(node, c) });
}

function removeClass(node, classes) {
    node && classes && classes.forEach(c => { removeOneClass(node, c) });
}

const CSSTransition = React.forwardRef((props, ref) => {
    const {
        onEnter,
        onEntering,
        onEntered,
        onExit,
        onExiting,
        onExited,
        ...restProps
    } = props;

    const getClassNames = (type) => {
        const { classNames } = props;
        const baseClassName = `${classNames}-${type}`;
        const activeClassName = `${baseClassName}-active`;
        const doneClassName = `${baseClassName}-done`;

        return {
            base: baseClassName,
            active: activeClassName,
            done: doneClassName
        }
    }

    const addClassNamesAndForceRepaint = (node, classNames, forceRepatin = false) => {
        if (forceRepatin) {
            // eslint-disable-next-line no-unused-expressions
            node && node.offsetLeft;
        }

        addClass(node, classNames);
    }

    const _onEnter = (node) => {
        const exitClassNames = Object.values(getClassNames('exit'));
        removeClass(node, exitClassNames);

        const enterClassName = getClassNames('enter').base;
        addClassNamesAndForceRepaint(node, [enterClassName]);

        onEnter && onEnter(node);
    }

    const _onEntering = (node) => {
        const enteringClassName = getClassNames('enter').active;
        addClassNamesAndForceRepaint(node, [enteringClassName], true);

        onEntering && onEntering(node);
    }

    const _onEntered = (node) => {
        const enterClassName = getClassNames('enter').base;
        const enteringClassName = getClassNames('enter').active;
        removeClass(node, [enterClassName, enteringClassName]);

        const enteredClassName = getClassNames('enter').done;
        addClassNamesAndForceRepaint(node, [enteredClassName]);

        onEntered && onEntered(node);
    }

    const _onExit = (node) => {
        const enterClassNames = Object.values(getClassNames('enter'));
        removeClass(node, enterClassNames);

        const exitClassName = getClassNames('exit').base;
        addClassNamesAndForceRepaint(node, [exitClassName]);

        onExit && onExit(node);
    }

    const _onExiting = (node) => {
        const exitingClassName = getClassNames('exit').active;
        addClassNamesAndForceRepaint(node, [exitingClassName], true);

        onExiting && onExiting(node);
    }

    const _onExited = (node) => {
        const exitClassName = getClassNames('exit').base;
        const exitingClassName = getClassNames('exit').active;
        removeClass(node, [exitClassName, exitingClassName]);

        const exitedClassName = getClassNames('exit').done;
        addClassNamesAndForceRepaint(node, [exitedClassName]);

        onExited && onExited(node);
    }

    return (
        <Transition
            nodeRef={ref}
            onEnter={_onEnter}
            onEntering={_onEntering}
            onEntered={_onEntered}
            onExit={_onExit}
            onExiting={_onExiting}
            onExited={_onExited}
            {...restProps}
        >
            {props.children}
        </Transition>
    )
})

export default CSSTransition;