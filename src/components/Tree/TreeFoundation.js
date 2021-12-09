import { getMotionKeys } from './treeUtils';

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

    handleNodeExpand(e, treeNode) {
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
}

export default TreeFoundation;