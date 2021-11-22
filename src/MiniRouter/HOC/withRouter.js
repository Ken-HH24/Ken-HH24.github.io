import { useContext } from 'react'
import { RouterContext } from '../BrowserRouter'

export default function withRouter(Component) {
    return function (props) {
        const routerContext = useContext(RouterContext);
        const { wrappedComponentRef, ...restProps } = props;

        return (
            <Component
                ref={wrappedComponentRef}
                {...routerContext}
                {...restProps}
            />
        )
    }
}