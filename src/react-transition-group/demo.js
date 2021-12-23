import React, { useState } from 'react';
import './styles/CSSTransition.css';
import './styles/TransitionGroup.css';
import './styles/SwitchTransition.css';
import CSSTransition from './CSSTransition';
import TransitionGroup from './TransitionGroup';
import SwitchTransition from './SwitchTransition';

// const TransitionDemo = () => {
//     const [show, setShow] = useState(false);

//     return (
//         <div>
//             <CSSTransition
//                 appear
//                 in={show}
//                 timeout={1000}
//                 unmountOnExit
//                 classNames='demo'
//             >
//                 <div>Hello World</div>
//             </CSSTransition>
//             <div onClick={() => { setShow(!show) }}>toggle</div>
//         </div>
//     )
// }

// function TransitionDemo() {
//     const [state, setState] = useState(false);
//     return (
//         <div>
//             <div style={{ overflow: 'hidden', display: 'inline-block' }}>
//                 <SwitchTransition mode='in-out'>
//                     <CSSTransition
//                         key={state ? "Goodbye, world!" : "Hello, world!"}
//                         classNames='fade'
//                         in={state}
//                         timeout={500}
//                     >
//                         <div>
//                             {state ? "Goodbye, world!" : "Hello, world!"}
//                         </div>
//                     </CSSTransition>
//                 </SwitchTransition >
//             </div>
//             <br />
//             <button onClick={() => setState(state => !state)}>
//                 toggle
//             </button>
//         </div>
//     );
// }

function TransitionDemo() {
    const [count, setCount] = useState(3);
    const [list, setList] = useState([
        { value: 1, key: '1' },
        { value: 2, key: '2' }
    ])

    const handleDelete = (index) => {
        const newList = [...list];
        newList.splice(index, 1);
        setList(newList);
    }

    const handleAdd = () => {
        const newList = [...list];
        newList.push({
            value: count,
            key: `${count}`
        });

        setCount(count + 1);
        setList(newList);
    }

    return (
        <div>
            <TransitionGroup>
                {
                    list.map((item, index) => {
                        return (
                            <CSSTransition
                                key={item.value}
                                timeout={2000}
                                classNames='list-fade'
                            >
                                <div>
                                    <span>{item.value}</span>
                                    <button onClick={() => { handleDelete(index) }}>delete</button>
                                </div>
                            </CSSTransition>
                        )
                    })
                }
            </TransitionGroup>
            <button onClick={() => { handleAdd() }}>add item</button>
        </div>
    )
}

export default TransitionDemo;