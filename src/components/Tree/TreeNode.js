import React, { useContext, useRef } from 'react';
import cls from 'classnames';
import "./styles/TreeNode.css";
import { FolderClose, FolderOpen, Notes, Right } from '@icon-park/react'
import TreeContext from './treeContext';

const TreeNode = (props) => {
    const {
        label,
        level,
        eventKey,
        expanded,
        children,
    } = props;
    const treeContext = useContext(TreeContext);
    const nodeRef = useRef(null);

    const onDragStart = (e) => {
        const { onNodeDragStart } = treeContext;
        e.stopPropagation();
        onNodeDragStart(e, { ...props, ref: nodeRef });

        e.dataTransfer.setData('text/plain', '');
    }

    const onDragEnter = (e) => {
        const { onNodeDragEnter } = treeContext;
        e.preventDefault();
        e.stopPropagation();
        onNodeDragEnter(e, { ...props, ref: nodeRef });

        e.dataTransfer.dropEffect = 'move';
    }

    const onDragOver = (e) => {
        const { onNodeDragOver } = treeContext;
        e.preventDefault();
        e.stopPropagation();
        onNodeDragOver(e, { ...props, ref: nodeRef });

        e.dataTransfer.dropEffect = 'move';
    }

    const onDragLeave = (e) => {
        const { onNodeDragLeave } = treeContext;
        e.stopPropagation();
        onNodeDragLeave(e, { ...props, ref: nodeRef });

        e.dataTransfer.dropEffect = 'move';
    }

    const onDragEnd = (e) => {
        const { onNodeDragEnd } = treeContext;
        e.stopPropagation();
        onNodeDragEnd(e, { ...props, ref: nodeRef });

        e.dataTransfer.dropEffect = 'move';
    }

    const onDrop = (e) => {
        const { onNodeDrop } = treeContext;
        e.stopPropagation();
        onNodeDrop(e, { ...props, ref: nodeRef });
    }

    const renderRightArrow = () => {
        if (!children || children.length === 0)
            return <svg width='24' height='24' viewBox='0 0 48 48' />

        const cls = `right ${expanded ? 'expanded' : ''}`;

        const handleRightClick = (e) => {
            const { onNodeExpand } = treeContext;
            e && e.stopPropagation();
            onNodeExpand(e, props);
        }

        return <Right
            className={cls}
            theme="outline"
            size="24"
            fill="#333"
            onClick={handleRightClick}
        />
    }

    const renderIcon = () => {
        if (children && children.length > 0) {
            return expanded
                ? <FolderOpen theme="outline" size="24" fill="#333" />
                : <FolderClose theme="outline" size="24" fill="#333" />
        } else {
            return <Notes theme="outline" size="24" fill="#333" />
        }
    }


    const PREFIX = 'tree-node';
    const { draggable, dropPosition, dragOverNodeKey } = treeContext;

    const dragProps = {
        onDragStart: onDragStart,
        onDragEnter: onDragEnter,
        onDragLeave: onDragLeave,
        onDragOver: onDragOver,
        onDragEnd: onDragEnd,
        onDrop: onDrop,
        draggable: draggable
    }

    const isDragOver = dragOverNodeKey === eventKey
    const classNames = cls(PREFIX, `${PREFIX}-level-${level}`, {
        [`${PREFIX}-bottom`]: isDragOver && dropPosition === 1,
        [`${PREFIX}-top`]: isDragOver && dropPosition === -1,
        [`${PREFIX}-in`]: isDragOver && dropPosition === 0
    })

    return (
        <li
            ref={nodeRef}
            className={classNames}
            {...dragProps}
        >
            {renderRightArrow()}
            {renderIcon()}
            <span className='tree-node-label'>{label}</span>
        </li>
    )
}

export default TreeNode;