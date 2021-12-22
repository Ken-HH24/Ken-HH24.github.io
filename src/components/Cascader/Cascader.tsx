import React, { useCallback, useEffect, useRef, useState } from 'react';
import { convertDataToEntities, getRenderData } from './cascaderUtils';
import Select from './Select';
import { BasicCascaderData, BasicEntity } from './types';
import Popover from './Popover';
import SelectItem from './SelectItem';
import useClickOutside from '../../hooks/useClickOutside';
import CascaderItem from './CascaderItem';

export interface CascaderProps {
    multiple?: boolean
    treeData: BasicCascaderData[]
}

const traverseChildren = (node: BasicEntity, callback: (param: string) => void) => {
    callback(node.key);
    if (node.children) {
        node.children.forEach(child => {
            traverseChildren(child, callback);
        })
    }
}

const Cascader: React.FC<CascaderProps> = (props) => {
    const { multiple, treeData } = props;

    const lastSelectedKey = useRef<any>(null);
    const cascaderRef = useRef<HTMLDivElement>(null);

    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState<any>('');
    const [activeKeys, setActiveKeys] = useState(new Set<string>());
    const [checkedKeys, setCheckedKeys] = useState(new Set<string>());
    const [selectedKeys, setSelectedKeys] = useState(new Set<string>());
    const [keyEntities, setKeyEntities] = useState(convertDataToEntities(treeData));

    useClickOutside(cascaderRef, () => { setIsOpen(false) })

    const handleItemClick = useCallback((key: string) => {
        const newActiveKeys = new Set<string>();
        let node: BasicEntity | undefined = keyEntities[key];
        while (node) {
            newActiveKeys.add(node.key);
            node = node.parent;
        }
        setActiveKeys(newActiveKeys);

        if (!multiple) {
            lastSelectedKey.current = { key, state: selectedKeys.has(key) ? 'delete' : 'add' };
            const newSelectedKeys = new Set(newActiveKeys);
            selectedKeys.has(key) && newSelectedKeys.delete(key);
            setSelectedKeys(newSelectedKeys);
        }
    }, [keyEntities, multiple, selectedKeys])

    const handleItemCheckboxClick = useCallback((key: string) => {
        const newCheckedKeys = new Set<string>(checkedKeys);

        const callback = checkedKeys.has(key)
            ? newCheckedKeys.delete.bind(newCheckedKeys)
            : newCheckedKeys.add.bind(newCheckedKeys);

        traverseChildren(keyEntities[key], callback);

        let entity = keyEntities[key].parent;
        while (entity) {
            if (entity.children && entity.children.every(child => newCheckedKeys.has(child.key))) {
                newCheckedKeys.add(entity.key);
            } else {
                newCheckedKeys.delete(entity.key);
            }
            entity = entity.parent;
        }

        setCheckedKeys(newCheckedKeys);
    }, [checkedKeys, keyEntities])

    const handleSelectItemClick = useCallback((key: string) => {
        const newCheckedKeys = new Set(checkedKeys);

        traverseChildren(keyEntities[key], (key: string) => {
            newCheckedKeys.delete(key);
        })
        setCheckedKeys(newCheckedKeys);
    }, [keyEntities, checkedKeys])

    useEffect(() => {
        if (lastSelectedKey.current && lastSelectedKey.current.state === 'add') {
            const entity = keyEntities[lastSelectedKey.current.key];
            if (!entity.children || entity.children.length === 0) {
                setIsOpen(false);
                setContent(entity.valuePath?.join(' / ') || '');
            }
        }
    }, [selectedKeys, keyEntities])

    useEffect(() => {
        const newContent: React.ReactNode[] = [];
        checkedKeys.forEach(key => {
            const entity = keyEntities[key];
            if (!entity.parentKey || !checkedKeys.has(entity.parentKey)) {
                newContent.push(
                    <SelectItem
                        key={entity.key}
                        value={entity.data.value}
                        eventKey={entity.key}
                        onDelete={handleSelectItemClick}
                    />
                )
            }
        })

        setContent(newContent);
    }, [checkedKeys, keyEntities, handleSelectItemClick])

    useEffect(() => {
        setKeyEntities(convertDataToEntities(treeData));
    }, [treeData])

    const renderSelect = () => {
        return (
            <Select
                isOpen={isOpen}
                handleClick={() => { setIsOpen(!isOpen) }}
                content={content}
            />
        )
    }

    const renderCascaderItem = () => {
        return (
            <CascaderItem
                activeKeys={activeKeys}
                checkedKeys={checkedKeys}
                selectedKeys={selectedKeys}
                multiple={multiple || false}
                data={getRenderData(keyEntities)}
                handleItemClick={handleItemClick}
                handleItemCheckboxClick={handleItemCheckboxClick}
            />
        )
    }

    return (
        <div ref={cascaderRef}>
            <Popover
                isShow={isOpen}
                content={renderCascaderItem()}
            >
                {renderSelect()}
            </Popover>
        </div>
    )
}

export default Cascader;