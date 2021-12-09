import React, { useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { ReactReduxContext as Context } from '../components/Provider';
import createSubscription from '../utils/Subscription';
import selectFactory from './selectFactory';

const EMPTY_ARRAY = [];
const initStateUpdates = () => [null, 0]

function storeStateUpdatesReducer(state, action) {
    const [, updateCount] = state
    return [action.payload, updateCount + 1]
}

function captureRestProps(
    lastChildProps,
    lastRestProps,
    renderIsScheduled,
    actualChildProps,
    restProps,
    childPropsFromStoreUpdate,
    notifyNestedSubs
) {
    lastChildProps.current = actualChildProps;
    lastRestProps.current = restProps;
    renderIsScheduled.current = false;

    if (childPropsFromStoreUpdate.current) {
        childPropsFromStoreUpdate.current = null;
        notifyNestedSubs();
    }
}

function subscribeUpdates(
    shouldHandleStateChnage,
    store,
    childPropsSelector,
    lastRestProps,
    lastChildProps,
    renderIsScheduled,
    notifyNestedSubs,
    childPropsFromStoreUpdate,
    forceUpdate,
    subscription,
) {
    if (!shouldHandleStateChnage)
        return;

    let didUnsubscribe = false;

    const checkForUpdates = () => {
        if (didUnsubscribe)
            return;

        const latestStoreState = store.getState();
        let newChildProps;

        newChildProps = childPropsSelector(latestStoreState, lastRestProps.current);

        if (newChildProps === lastChildProps.current) {
            if (!renderIsScheduled) {
                notifyNestedSubs();
            }
        } else {
            lastChildProps.current = newChildProps;
            childPropsFromStoreUpdate.current = newChildProps;
            renderIsScheduled.current = true;

            forceUpdate({
                type: 'STORE_UPDATED',
                payload: {},
            });
        }
    }

    subscription.onStateChange = checkForUpdates;
    subscription.trySubscribe();

    checkForUpdates();

    const unSubscribe = () => {
        didUnsubscribe = true;
        subscription.tryUnSubscribe();
        subscription.onStateChange = null;
    }

    return unSubscribe;
}

export default function connect(mapStateToProps, mapDispatchToProps) {
    //  1. 用proxy处理mapToProps
    const shouldHandleStateChnage = Boolean(mapStateToProps);

    //  2. HOC wrapWithConnect
    const WrapWithConnect = (WrappedComponent) => {
        //  2.0 使用闭包将mapToProps过程处理
        // function createChildSelector(store) {
        //     return selectFactory(store.dispatch, mapStateToProps, mapDispatchToProps);
        // }

        function ConnectFunction(props) {
            //  2.1 获取props中的context，restProps
            const [propsContext, ...restProps] = useMemo(() => {
                const { ...restProps } = props;
                return [props.context, restProps];
            }, [props]);

            //  2.2 获取真正的context
            const ContextToUse = useMemo(() => {
                return (propsContext && propsContext.Consumer)
                    ? propsContext
                    : Context
            }, [propsContext, Context]);

            const didComeFromProps = Boolean(props.store)
                && Boolean(props.store.dispatch)
                && Boolean(props.store.getState)

            //  2.3 获取context value
            const contextValue = useContext(ContextToUse);
            const store = didComeFromProps ? props.store : contextValue.store;

            //  2.4 mergedProps函数
            const childPropsSelector = useMemo(() => {
                return selectFactory(store.dispatch, mapStateToProps, mapDispatchToProps);
            }, [store])

            //  2.5 subscription
            const [subscription, notifyNestedSubs] = useMemo(() => {
                const subscription = createSubscription(store, didComeFromProps ? null : contextValue.subscription);
                const notifyNestedSubs = subscription.notifyNestedSubs.bind(subscription);
                return [subscription, notifyNestedSubs];
            }, [store, didComeFromProps, contextValue])

            //  2.6 生成新context
            const overriddenContextValue = useMemo(() => {
                if (didComeFromProps)
                    return contextValue;

                return {
                    ...contextValue,
                    subscription
                }
            }, [didComeFromProps, contextValue, subscription])

            //  2.7 声明缓存变量
            let lastChildProps = useRef();
            let lastRestProps = useRef(restProps);
            let childPropsFromStoreUpdate = useRef();
            let renderIsScheduled = useRef(false);

            //  2.8 actualChildProps变量
            const actualChildProps = useMemo(() => {
                if (childPropsFromStoreUpdate.current && lastRestProps.current === restProps)
                    return childPropsFromStoreUpdate.current;

                return childPropsSelector(store.getState(), restProps);
            })

            //  2.9 subscription处理
            const [
                [previousStateUpdateResult],
                forceUpdate,
            ] = useReducer(storeStateUpdatesReducer, EMPTY_ARRAY, initStateUpdates)

            useEffect(() => {
                return subscribeUpdates(
                    shouldHandleStateChnage,
                    store,
                    childPropsSelector,
                    lastRestProps,
                    lastChildProps,
                    renderIsScheduled,
                    notifyNestedSubs,
                    childPropsFromStoreUpdate,
                    forceUpdate,
                    subscription,
                )
            }, [store, subscription, childPropsSelector])

            //  2.10 captureRestProps
            useEffect(() => {
                captureRestProps(
                    lastChildProps,
                    lastRestProps,
                    renderIsScheduled,
                    actualChildProps,
                    restProps,
                    childPropsFromStoreUpdate,
                    notifyNestedSubs
                )
            })

            //  2.11 render
            const renderWrappedComponent = useMemo(
                () => <WrappedComponent {...actualChildProps} />,
                [actualChildProps, WrappedComponent]

            )

            const renderedChild = useMemo(() => {
                if (shouldHandleStateChnage) {
                    return (
                        <ContextToUse.Provider value={overriddenContextValue}>
                            {renderWrappedComponent}
                        </ContextToUse.Provider>
                    )
                }
            }, [overriddenContextValue, renderWrappedComponent, ContextToUse])

            return renderedChild;
        }

        //  3. memo处理
        const Connect = React.memo(ConnectFunction);
        return Connect;
    }

    return WrapWithConnect;
}
