import React, { useContext } from 'react';
import { matchPath } from 'react-router';
import { RouterContext } from './BrowserRouter';

const Switch = (props) => {
    const routerContext = useContext(RouterContext);
    const location = props.location || routerContext.location;

    let match, children;

    React.Children.forEach(props.children, (child) => {
        if (!match && React.isValidElement(child)) {
            const path = child.props.path;
            children = child;
            match = path && matchPath({ ...child.props }, location.pathname);
        }
    })

    return match ? React.cloneElement(children, { computedMatch: match }) : null;
}

export default Switch