import React from 'react';
import useHitory from './hooks/useHistory';

const Link = (props) => {
    const { to, children, ...restProps } = props;
    const history = useHitory();

    const handleClick = (e) => {
        e.preventDefault();
        history.push(to);
    }

    return (
        <a
            src='/'
            href='/'
            onClick={handleClick}
            {...restProps}
        >{children}</a>
    )
}

export default Link;