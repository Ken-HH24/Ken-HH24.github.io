import React from 'react';
import { ENTERED, ENTERING } from './Transition';
import TransitionGroupContext from './TransitionGroupContext';
import { getInitialChildMapping, getNextChildMapping } from './utils/utils';

class TransitionGroup extends React.Component {
    constructor(props) {
        super(props);
        const handleExited = this.handleExited.bind(this);

        this.deleteAction = false;
        this.lastNodeRefs = [];

        this.state = {
            firstRender: true,
            status: ENTERED,
            nodeRefs: [],
            children: {},
            handleExited
        }
    }

    componentDidMount() {
        this.setState({
            status: ENTERING
        })
    }

    // FLIP
    componentDidUpdate() {
        const currentRectMap = this.state.rectMap;

        if (this.lastRectMap) {
            const lastRectMap = this.lastRectMap;

            for (const ref of currentRectMap.keys()) {
                if (lastRectMap.has(ref)) {
                    const prevPosition = lastRectMap.get(ref);
                    const currentPosition = currentRectMap.get(ref);

                    const invert = {
                        left: prevPosition.left - currentPosition.left,
                        top: prevPosition.top - currentPosition.top
                    }

                    const keyframes = [
                        {
                            transform: `translate(${invert.left}px, ${invert.top}px)`,
                        },
                        { transform: "translate(0)" },
                    ]

                    const options = {
                        duration: 300,
                        easing: "cubic-bezier(0,0,0.32,1)",
                    }

                    ref.animate(keyframes, options)
                }
            }
        }

        this.lastRectMap = currentRectMap;
    }

    static getDerivedStateFromProps(nextProps, { children: prevChildrenMapping, firstRender, handleExited }) {
        const { result, rectMap } = firstRender
            ? getInitialChildMapping(nextProps.children)
            : getNextChildMapping(nextProps, prevChildrenMapping, handleExited);
        return {
            rectMap,
            children: result,
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