import { calcDropRelativePosition, getDragNodeKeys, getMotionKeys } from './treeUtils';

class TreeFoundation {
    constructor(adapter) {
        this._adapter = { ...adapter };
    }

    getState(key) {
        return this._adapter.getState(key);
    }

    getStates() {
        return this._adapter.getStates();
    }

    setExpandedStatus(treeNode) {
        const { expandedKeys = new Set(), keyEntities } = this.getStates() || {};
        const { eventKey, expanded } = treeNode;
        const newExpandedKeys = new Set(expandedKeys);

        let motionType = 'show';
        if (!expanded) {
            newExpandedKeys.add(eventKey);
        } else {
            newExpandedKeys.delete(eventKey);
            motionType = 'hide';
        }

        const motionKeys = getMotionKeys(eventKey, expandedKeys, keyEntities);

        this._adapter.updateState({
            expandedKeys: newExpandedKeys,
            motionType,
            motionKeys
        });
    }

    updateTreeDataAfterDrop(dragToGap, node, dragNode) {
        const { treeData } = this.getStates() || {};
        const nodeKey = node.eventKey;
        const dragKey = dragNode.eventKey;
        const res = [...treeData];
        const loop = (data, key, callback) => {
            data.forEach((item, ind, arr) => {
                if (item.key === key)
                    callback(item, ind, arr);
                if (item.children)
                    loop(item.children, key, callback);
            })
        }

        if (nodeKey === dragKey)
            return res;

        // 1. 删除移动节点的原来位置
        let dragObj;
        loop(res, dragKey, (item, ind, arr) => {
            dragObj = item;
            arr.splice(ind, 1);
        })

        // 2. 刚好放入节点内
        if (!dragToGap) {
            loop(res, nodeKey, (item, ind, arr) => {
                item.children = item.children || [];
                item.children.push(dragObj);
            });
            // 3. 放到节点的children第一个
        } else if (dragToGap === 1 && node.expanded && node.children) {
            loop(res, nodeKey, (item, ind, arr) => {
                item.children = item.children || [];
                item.children.unshift(dragNode);
            })
            // 4. 放入上一位或下一位
        } else {
            loop(res, nodeKey, (item, ind, arr) => {
                if (dragToGap === -1)
                    arr.splice(ind, 0, dragObj);
                else
                    arr.splice(ind + 1, 0, dragObj);
            })
        }

        return res;
    }

    handleNodeExpand(e, treeNode) {
        this.setExpandedStatus(treeNode);
    }

    handleNodeDragStart(e, treeNode) {
        const { keyEntities } = this.getStates() || {};
        const { eventKey } = treeNode;

        // 1. 设置正在拖拽的node
        this._adapter.setDragNode(treeNode);

        // 2. 设置拖拽状态，保存需要拖拽的节点
        this._adapter.updateState({
            dragging: true,
            dragNodeKeys: getDragNodeKeys(eventKey, keyEntities)
        });
    }

    handNodeDragEnter(e, treeNode, dragNode) {
        const { dragging, dragNodeKeys } = this.getStates() || {};
        const { eventKey, pos } = treeNode;

        const dropPosition = calcDropRelativePosition(e, treeNode);

        // 1. 如果仍是该节点，return
        if (!dragNode && dragNodeKeys.has(eventKey))
            return;

        // 2. 如果为自身，清空
        if (dragNode.eventKey === eventKey && dropPosition === 0) {
            this._adapter.updateState({
                dragOverNodeKey: '',
                dropPosition: null
            })
            return;
        }

        // 3. 更新
        setTimeout(() => {
            this._adapter.updateState({
                dragOverNodeKey: eventKey,
                dropPosition
            })

            if (!this.delayDragEnterLogic)
                this.delayDragEnterLogic = {};

            // 清空之前的expand状态
            Object.keys(this.delayDragEnterLogic).forEach(key => {
                clearTimeout(this.delayDragEnterLogic[key]);
            })

            // 展开
            this.delayDragEnterLogic[pos] = setTimeout(() => {
                if (!dragging || treeNode.expanded)
                    return;

                this.setExpandedStatus(treeNode);
            }, 400);
        }, 0);
    }

    handleNodeDragOver(e, treeNode, dragNode) {
        const { dropPosition, dragOverNodeKey } = this._adapter.getStates() || {};
        const { eventKey } = treeNode;

        if (dragNode && dragOverNodeKey === eventKey) {
            const newPos = calcDropRelativePosition(e, treeNode);
            if (dropPosition === newPos)
                return;

            this._adapter.updateState({
                dropPosition: newPos
            })
        }
    }

    handleNodeDragLeave(e, treeNode) {
        this._adapter.updateState({
            dragOverNodeKey: ''
        })
    }

    handleNodeDragEnd(e, treeNode) {
        this._adapter.updateState({
            dragOverNodeKey: '',
            dragging: false
        })
        this._adapter.setDragNode(null);
    }

    handleNodeDrop(e, treeNode, dragNode) {
        this._adapter.updateState({
            dragOverNodeKey: '',
            dragging: false
        })

        const { dropPosition } = this.getStates();
        const dragToGap = dropPosition !== 0;
        const newTreeData = this.updateTreeDataAfterDrop(dragToGap, treeNode, dragNode);
        this._adapter.updateState({
            treeData: newTreeData
        })

        this._adapter.setDragNode(null);
    }
}

export default TreeFoundation;
