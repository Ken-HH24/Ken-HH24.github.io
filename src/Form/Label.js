import React from 'react';

const Label = ({
    label,
    required,
    children,
}) => {
    return (
        <div className='label-wrapper'>
            {required && <span className='required'>*</span>}
            <span className='label-content'>{label}</span>
            {children}
        </div>
    )
}

export default Label;