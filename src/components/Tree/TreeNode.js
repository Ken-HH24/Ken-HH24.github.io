import React, { useContext } from 'react';
import "./styles/TreeNode.css";
import { FolderClose, FolderOpen, Notes, Right } from '@icon-park/react'
import TreeContext from './treeContext';

const TreeNode = (props) => {
    const {
        label,
        level,
        expanded,
        children,
    } = props;
    const treeContext = useContext(TreeContext);

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

    const cls = `tree-node tree-node-level-${level}`

    return (
        <li className={cls}>
            {renderRightArrow()}
            {renderIcon()}
            <span className='tree-node-label'>{label}</span>
        </li>
    )
}

export default TreeNode;