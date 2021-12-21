import React from 'react';
import './styles/cascaderSelectItem.css';
import { Close } from '@icon-park/react'

export interface SelectItemProps {
    key: string
    value: string
    eventKey: string
    onDelete: (key: string) => void
}

const SelectItem: React.FC<SelectItemProps> = (props) => {
    const { value, eventKey } = props;

    const handleSelectItemClick = (e: React.MouseEvent, key: string) => {
        const { onDelete } = props;
        e.stopPropagation();
        onDelete(key);
    }

    return (
        <div className='select-item' onClick={(e) => { handleSelectItemClick(e, eventKey) }}>
            <span className='select-item-value'>{value}</span>
            <Close className='icon' />
        </div>
    )
}

export default React.memo(SelectItem);