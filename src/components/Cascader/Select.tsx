import * as React from 'react';
import './styles/cascaderSelect.css';
import { Right } from '@icon-park/react';
import cls from 'classnames';

interface SelectProps {
    content: any
    isOpen: boolean
    handleClick: () => void
}

const Select: React.FC<SelectProps> = (props) => {
    const { isOpen, content, handleClick } = props;

    const PREFIX = 'cascader-select';
    const classNames = cls(PREFIX, {
        'open': isOpen
    })

    return (
        <div
            className={classNames}
            onClick={() => { handleClick() }}
        >
            {content}
            <span className={`${PREFIX}-right`}>
                <Right />
            </span>
        </div>
    );
}

export default React.memo(Select);