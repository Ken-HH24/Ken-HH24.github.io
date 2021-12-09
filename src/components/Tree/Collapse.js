import React, { useCallback, useState } from 'react';
import { useSpring, animated } from 'react-spring';
import './styles/Collapse.css';

const Collapse = (props) => {
    const {
        motionType,
        onMotionEnd,
        children
    } = props;

    const [maxHeight, setMaxHeight] = useState(null);
    const hideProps = useSpring({
        to: { maxHeight: 0 },
        from: { maxHeight: maxHeight + 50 },
        onRest: () => { motionType === 'hide' && onMotionEnd && onMotionEnd() }
    })

    const showProps = useSpring({
        to: { maxHeight: maxHeight + 50 },
        from: { maxHeight: 0 },
        onRest: () => { motionType === 'show' && onMotionEnd && onMotionEnd() }
    })

    const setHeight = useCallback(node => {
        if (node && node.scrollHeight) {
            setMaxHeight(node.scrollHeight);
        }
    }, [])

    if (maxHeight) {
        return (
            <animated.div
                style={motionType === 'show' ? showProps : hideProps}
                className='collapse'
            >
                {children}
            </animated.div>
        )
    }

    return (
        <div className='collapse'>
            <div ref={setHeight}>
                {children}
            </div>
        </div>
    )
}

export default Collapse;