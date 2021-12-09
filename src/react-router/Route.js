import React, { useContext } from 'react';
import { matchPath } from 'react-router';
import { RouterContext } from './BrowserRouter';

const Route = (props) => {
    const routerContext = useContext(RouterContext);
    const location = props.location || routerContext.location;

    const match = props.computedMatch ? props.computedMatch
        : props.path ? matchPath({ ...props }, location.pathname) : routerContext.match;

    const newRouterContext = { ...routerContext, location, match };

    const { children, component, render } = props;
    let renderChildren = null;
    if (newRouterContext.match) {
        if (props.children) {
            renderChildren = typeof children === 'function' ? children(newRouterContext) : children;
        } else if (component) {
            renderChildren = React.createElement(component, newRouterContext);
        } else if (render) {
            renderChildren = render(newRouterContext);
        }
    }

    return <RouterContext.Provider value={newRouterContext}>
        {renderChildren}
    </RouterContext.Provider>
}

export default Route