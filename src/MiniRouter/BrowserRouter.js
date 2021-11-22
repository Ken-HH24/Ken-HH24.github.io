import React, { createContext, useEffect, useMemo, useState } from 'react';
import { createBrowserHistory } from 'history';

export const RouterContext = createContext();
export let rootHistory;

const BrowserRouter = (props) => {
    const history = useMemo(() => {
        rootHistory = createBrowserHistory();
        return rootHistory;
    }, []);

    const [location, setLocation] = useState(history.location);

    useEffect(() => {
        const unlisten = history.listen((history) => {
            setLocation(history.location);
        })

        return function () {
            unlisten && unlisten();
        }
    }, []);

    return (
        <RouterContext.Provider
            value={{
                history,
                location,
                match: { path: '/', url: '/', isExact: location.pathname === '/' }
            }}
        >
            {props.children}
        </RouterContext.Provider>
    )
}

export default BrowserRouter;
