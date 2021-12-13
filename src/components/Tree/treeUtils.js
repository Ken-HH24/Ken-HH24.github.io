function getPosition(parentPos, index) {
    return `${parentPos}-${index}`;
}

export function flattenTreeData(treeNodeList, expandedKeys) {
    const flattenList = [];

    const flatten = (list, parent = null) => {
        return (list || []).map((treeNode, index) => {
            const flattenNode = {
                ...treeNode,
                pos: getPosition(parent ? parent.pos : '0', index),
                level: parent ? parent.level + 1 : 0,
                children: [],
                parent,
                data: treeNode
            }

            flattenList.push(flattenNode);

            if (expandedKeys.has(flattenNode.key)) {
                flattenNode.children = flatten(treeNode.children, flattenNode);
            } else {
                flattenNode.children = [];
            }

            return flattenNode;
        });
    }

    flatten(treeNodeList);
    return flattenList;
}

export function convertDataToEntities(dataNodes) {
    const posEntities = {};
    const keyEntities = {};
    const wrapper = {
        posEntities,
        keyEntities,
    }

    traverseDataNodes(dataNodes, (data) => {
        const { pos, key, parentPos } = data;
        const entity = { ...data };

        posEntities[pos] = entity;
        keyEntities[key] = entity;

        entity.parent = posEntities[parentPos];
        if (entity.parent) {
            entity.parent.children = entity.parent.children || [];
            entity.parent.children.push(entity);
        }
    })

    return wrapper;
}

export function traverseDataNodes(treeNodes, callback) {
    const processNode = (node, index, parent) => {
        const children = node ? node.children : treeNodes;
        const pos = node ? getPosition(parent.pos, index) : '0';

        if (node) {
            const data = {
                data: { ...node },
                index,
                pos,
                level: parent ? parent.level + 1 : 1,
                key: node.key || pos,
                parentPos: parent ? parent.pos : '0',
            }

            callback(data)
        }

        if (children) {
            children.forEach((subNode, subIndex) => {
                processNode(subNode, subIndex, {
                    node,
                    pos,
                    level: parent ? Number(parent.level) + 1 : -1
                });
            })
        }
    }

    processNode(null);
}

export function getTreeNodeProps(treeNode, treeState) {
    const {
        keyEntities = {},
        expandedKeys = new Set()
    } = treeState;

    const { key } = treeNode;
    const data = keyEntities[key] || {};

    return {
        ...data,
        eventKey: key,
        expanded: expandedKeys.has(key)
    }
}

export function getMotionKeys(eventKey, expandedKeys, keyEntities = {}) {
    const res = new Set();

    const getChild = (child) => {
        const { key } = child;
        res.add(key);
        if (expandedKeys.has(key))
            traverseChildren(keyEntities[key], getChild);
    }
    traverseChildren(keyEntities[eventKey], getChild)
    return res;
}

export function getDragNodeKeys(eventKey, keyEntities) {
    const res = new Set();

    const getChildrenKeys = (child) => {
        const { key } = child;
        res.add(key);
        traverseChildren(keyEntities[key], getChildrenKeys);
    }

    res.add(eventKey);
    traverseChildren(keyEntities[eventKey], getChildrenKeys);
    return res;
}

export function traverseChildren(treeNode, callback) {
    treeNode && treeNode.children &&
        treeNode.children.forEach(child => {
            callback(child);
        })
}

export function calcDropRelativePosition(event, treeNode) {
    const { clientY } = event;
    const { top, bottom, height } = treeNode.ref.current.getBoundingClientRect();

    const DRAG_OFFSET = 0.4;
    if (clientY <= top + height * DRAG_OFFSET)
        return -1;

    if (clientY >= bottom - height * DRAG_OFFSET)
        return 1;

    return 0;
}