import React from 'react';
import './styles/cascaderPopover.css';

interface PopoverProps {
    isShow: boolean
    content: React.ReactNode
    children: React.ReactElement
}

const Popover: React.FC<PopoverProps> = (props) => {
    const { isShow, content, children } = props;

    return (
        <div className='cascader-popover'>
            {children}
            <div className='popover-portal'>
                {isShow && content}
            </div>
        </div>
    );
}

export default React.memo(Popover);