import React from 'react';
import cls from 'classnames';
import { BasicEntity } from './types';
import { Right, Check } from '@icon-park/react';

interface CascaderItemProps {
    multiple: boolean
    data: BasicEntity[]
    activeKeys: Set<string>
    checkedKeys: Set<string>
    selectedKeys: Set<string>
    children?: React.ReactElement
    handleItemClick: (key: string) => void
    handleItemCheckboxClick: (key: string) => void
}

const CascaderItem: React.FC<CascaderItemProps> = (props) => {
    const {
        data,
        multiple,
        handleItemClick,
    } = props;

    const handleItemChecked = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
        const { handleItemCheckboxClick } = props;
        e.stopPropagation();
        handleItemCheckboxClick(key);
    }

    const getItemState = (key: string) => {
        const { activeKeys, checkedKeys, selectedKeys } = props;
        const active = activeKeys.has(key);
        const checked = checkedKeys.has(key);
        const selected = selectedKeys.has(key);
        return {
            active,
            checked,
            selected
        }
    }

    const renderItem = (renderData: BasicEntity[], content: Array<React.ReactNode>): React.ReactElement => {
        let showChildrenData: BasicEntity[] | null = null;

        content.push(
            <ul key={renderData[0]?.key || 'ul'} className='cascader-item-list'>
                {
                    renderData.map(item => {
                        const { key, children } = item;
                        const { value } = item.data;
                        const { active, checked, selected } = getItemState(key);
                        const isLeaf = !item.children || item.children.length === 0;
                        const classNames = cls('cascader-item', {
                            'selected': selected,
                            'active': active,
                            'leaf': isLeaf
                        })

                        if (active)
                            showChildrenData = children || [];

                        return (
                            <li
                                key={key}
                                className={classNames}
                                onClick={() => { handleItemClick(key) }}
                            >
                                {
                                    multiple &&
                                    <input
                                        type='checkbox'
                                        checked={checked}
                                        onChange={(e) => { handleItemChecked(e, key) }}
                                    />
                                }
                                <span className='item-value'>{value}</span>
                                {!isLeaf && <Right className='item-icon' />}
                                {isLeaf && selected && <Check className='item-icon' />}
                            </li>
                        )
                    })
                }
            </ul>
        )

        if (showChildrenData && (showChildrenData as BasicEntity[]).length > 0) {
            return renderItem(showChildrenData, content);
        }

        return (
            <div className='cascader-item-list-wrapper'>
                {content}
            </div>
        )
    }

    return renderItem(data, []);
}

export default CascaderItem;