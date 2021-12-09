import { useContext } from 'react';
import { RouterContext } from '../BrowserRouter';

export default function useLocation() {
    return useContext(RouterContext).location;
}