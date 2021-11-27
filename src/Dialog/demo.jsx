import React, { useState } from 'react';
import Modal from './Modal';
import './Dialog.css';

const DialogDemo = () => {
    const [visible, setVisible] = useState(false);

    const handleClose = () => {
        setVisible(false);
    }

    const hanadleClick = () => {
        Modal.show({
            visible: visible,
            onClose: () => { setVisible(false) },
            title: 'Hello World',
            content: <div>This is a test</div>,
        })
    }

    return (
        <div>
            <Modal
                visible={visible}
                title='hello world'
                onClose={handleClose}
            >
                <div>This is a test</div>
            </Modal>
            <div onClick={() => { setVisible(true) }}>show modal</div>
            <div onClick={hanadleClick}>modal.show</div>
        </div>
    )
}

export default DialogDemo