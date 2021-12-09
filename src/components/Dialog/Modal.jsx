import React, { useEffect, useState } from 'react';
import ReactDom from 'react-dom';
import Dialog from './Dialog';

class Modal extends React.PureComponent {
    renderTop() {
        const { title, onClose } = this.props;
        return (
            <div className='modal-top'>
                <span className='modal-top-title'>{title}</span>
                <span
                    className='modal-top-close'
                    onClose={() => { onClose && onClose() }}
                >{title}</span>
            </div>
        )
    }

    renderContent() {
        const { children, content } = this.props;
        if (content && React.isValidElement(content))
            return content;
        else
            return children ? children : null;
    }

    renderFooter() {
        const { footer, onOK, onCancel } = this.props;
        if (footer && React.isValidElement(footer))
            return footer;
        return (
            <div className='modal-footer'>
                <button onClick={() => { onOK && onOK() }}>OK</button>
                <button onCancel={() => { onCancel && onCancel() }}>Cancel</button>
            </div>
        )
    }

    render() {
        const { visible, width = 500, onClose, closeCb, } = this.props;
        return (
            <Dialog
                visible={visible}
                closeCb={closeCb}
                onClose={onClose}
                width={width}
            >
                {this.renderTop()}
                {this.renderContent()}
                {this.renderFooter()}
            </Dialog>
        )
    }
}

let modalElement = null;
const modalSymbol = Symbol('$$_Modal_Element');

Modal.show = function (config) {
    // 已经挂载，防止二次执行
    if (modalElement)
        return;

    const container = document.createElement('div');
    modalElement = container;

    const manager = modalElement[modalSymbol] = {
        mounted: false,
        setShow: null,
        hidden() {
            const { setShow } = manager;
            setShow(false);
        },

        destroy() {
            ReactDom.unmountComponentAtNode(container);
            document.body.removeChild(container);
            modalElement = null;
        }
    }

    const ModalApp = () => {
        const [show, setShow] = useState(false);

        useEffect(() => {
            manager.mounted = true;
            setShow(true);
        }, []);

        const newProps = {
            ...config,
            visible: show,
            onClose: () => { setShow(false) },
            closeCb: () => {
                config.closeCb && config.closeCb();
                manager.mounted && setTimeout(() => {
                    manager.destroy();
                }, 300);
            }
        }

        //  保存到manager，方便hidden的时候调用
        manager.setShow = setShow;

        return (
            <Modal {...newProps} />
        )
    }

    document.body.appendChild(container);
    ReactDom.render(<ModalApp />, container);
    return manager;
}

Modal.hidden = function () {
    modalElement && modalElement[modalSymbol].hidden();
}

export default Modal;