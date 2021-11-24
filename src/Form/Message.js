import React from 'react';

const Message = (props) => {
    const { value, message, status, required, name } = props;
    let showMessage = '';
    let color = '#fff'
    if (required && value === '') {
        showMessage = `${name} required`;
        color = 'red';
    } else if (status === 'reject') {
        showMessage = message;
        color = 'red';
    } else if (status === 'resolve') {
        showMessage = 'pass';
        color = 'green';
    }

    return (
        <div className='message-container'>
            <span style={{ color }}>{showMessage}</span>
        </div>
    )
}

export default Message;