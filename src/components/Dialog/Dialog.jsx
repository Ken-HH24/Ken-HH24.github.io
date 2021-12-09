import React, { useEffect, useMemo, useState } from 'react';
import ReactDom from 'react-dom';

function controlShow(f1, f2, visible, timeout) {
    f1(visible);
    return setTimeout(() => {
        f2(visible);
    }, timeout);
}

const Dialog = (props) => {
    const { visible, width, closeCb, onClose, children } = props;
    const [modelShow, setModelShow] = useState(visible);
    const [modelShowAsync, setModelShowAsync] = useState(visible);

    const renderChildren = useMemo(() => {
        let transitionDelay = visible ? 'appear' : 'disappear';

        return ReactDom.createPortal(
            <div
                className={`dialog-container ${transitionDelay}`}
                style={{ visibility: modelShow ? 'visible' : 'hidden' }}
            >
                <div
                    className='dialog-content'
                    style={{
                        opacity: modelShowAsync ? 1 : 0,
                        width: `${width}px`
                    }}
                >
                    <div>
                        {children}
                    </div>
                </div>
                <div
                    className='dialog-mask'
                    style={{ opacity: modelShow ? 0.6 : 0 }}
                    onClick={() => { onClose && onClose() }}
                ></div>
            </div>,
            document.body
        )
    }, [modelShow, modelShowAsync]);

    useEffect(() => {
        let timer;
        if (visible) {
            timer = controlShow(setModelShow, setModelShowAsync, true, 300);
        } else {
            timer = controlShow(setModelShowAsync, setModelShow, false, 500);
        }

        return () => {
            timer && clearTimeout(timer);
        }
    }, [visible]);

    useEffect(() => {
        !modelShow && closeCb && closeCb();
    }, [modelShow])

    return renderChildren;
}

export default Dialog;
