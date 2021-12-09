import { useContext } from 'react';
import { RouterContext } from '../BrowserRouter';

export default function useHistory() {
    return useContext(RouterContext).history;
}