import React, { useEffect, useMemo } from 'react';
import createSubscription from '../utils/Subscription';

export const ReactReduxContext = React.createContext(null);

const Provider = (props) => {
    const { store, context, children } = props;

    const contextValue = useMemo(() => {
        const subscription = createSubscription(store);

        return {
            store,
            subscription
        }
    }, [store])

    const previousState = useMemo(() => store.getState(), [store]);

    useEffect(() => {
        const { subscription } = contextValue;
        subscription.onStateChange = subscription.notifyNestedSubs;
        subscription.trySubscribe();

        if (previousState !== store.getState()) {
            subscription.notifyNestedSubs();
        }

        return () => {
            subscription.onStateChange = null;
            subscription.tryUnSubscribe();
        }
    }, [])

    const Context = context || ReactReduxContext;

    return (
        <Context.Provider value={contextValue}>
            {children}
        </Context.Provider>
    )
}

export default Provider;