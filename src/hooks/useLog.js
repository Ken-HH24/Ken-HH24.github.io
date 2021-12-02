import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

export const LogContext = createContext({});

export function useLog() {
    const message = useContext(LogContext);
    const domRef = useRef(null);

    const reportLog = useCallback(function (target) {
        console.log(target, message);
    }, [message]);

    useEffect(() => {
        const handleClick = (e) => {
            reportLog(e.target);
        }

        if (domRef.current)
            domRef.current.addEventListener('click', handleClick);

        return () => {
            if (domRef.current)
                domRef.current.removeEventListener('click', handleClick);
        }
    }, [reportLog])

    return [domRef, reportLog];
}

const Index = () => {
    const [domRef, reportLog] = useLog();
    console.log('render');

    return (
        <div ref={domRef}>
            <div>inner click</div>
            <div>another inner click</div>
        </div>
    )
}

const LogDemo = () => {
    const [logInfo, setLogInfo] = useState({ name: 'Ken', age: 21 });

    return (
        <LogContext.Provider value={logInfo}>
            <div onClick={() => { setLogInfo({ name: 'Tony', age: 20 }) }}>
                change context
            </div>
            {
                useMemo(() => {
                    return <Index />
                }, [])
            }
        </LogContext.Provider>
    )
}

export default LogDemo;