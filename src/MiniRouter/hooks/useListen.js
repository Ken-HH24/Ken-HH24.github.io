import { useEffect } from 'react'
import { rootHistory } from '../BrowserRouter'

const useListen = (callback) => {
    useEffect(() => {
        if (!rootHistory)
            return () => { }

        const unListen = rootHistory.listen((location) => {
            callback && callback(location);
        });

        return () => {
            unListen && unListen();
        }
    }, [])
}

export default useListen;