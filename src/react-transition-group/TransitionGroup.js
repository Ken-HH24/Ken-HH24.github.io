import React from 'react';
import { ENTERED, ENTERING } from './Transition';
import TransitionGroupContext from './TransitionGroupContext';
import { getInitialChildMapping, getNextChildMapping } from './utils/utils';

class TransitionGroup extends React.Component {
    constructor(props) {
        super(props);
        const handleExited = this.handleExited.bind(this);

        this.state = {
            firstRender: true,
            status: ENTERED,
            children: {},
            handleExited
        }
    }

    componentDidMount() {
        this.setState({
            status: ENTERING
        })
    }

    componentDidUpdate(prevProps, prevState) {
        console.log(prevState.children, this.state.children);
    }

    static getDerivedStateFromProps(nextProps, { children: prevChildrenMapping, firstRender, handleExited }) {
        return {
            children: firstRender
                ? getInitialChildMapping(nextProps.children)
                : getNextChildMapping(nextProps, prevChildrenMapping, handleExited),
            firstRender: false
        }
    }

    handleExited(child, node) {
        this.setState((prevState) => {
            const children = { ...prevState.children };
            delete children[child.key];
            return {
                children
            }
        })
    }

    render() {
        const { children, status } = this.state;
        const component = Object.values(children);

        return (
            <TransitionGroupContext.Provider value={{ status }}>
                {component}
            </TransitionGroupContext.Provider>
        )
    }
}

// const TransitionGroup = (props) => {
//     const firstRender = useRef(true);
//     const childrenMapRef = useRef({});
//     const [, forceUpdate] = useState({});

//     let childrenMap;
//     const handleExited = (child) => {
//         const newChildrenMap = { ...childrenMapRef.current };
//         delete newChildrenMap[child.key];
//         childrenMapRef.current = newChildrenMap;
//         forceUpdate({});
//     }

//     if (firstRender.current === true) {
//         firstRender.current = false;
//         childrenMap = getInitialChildMapping(props.children);
//     } else {
//         childrenMap = getNextChildMapping(props, childrenMapRef.current, handleExited);
//     }

//     useLayoutEffect(() => {
//         console.log('layout')
//     }, [])

//     childrenMapRef.current = childrenMap;
//     const component = Object.values(childrenMap);

//     return (
//         <TransitionGroupContext.Provider value={null}>
//             {component}
//         </TransitionGroupContext.Provider>
//     )
// }

export default TransitionGroup;