import React from 'react';
import { isEqual } from 'lodash';
import Collapse from './Collapse';
import TreeContext from './treeContext';

class NodeList extends React.PureComponent {
    static contextType = TreeContext

    constructor(props) {
        super(props);
        this.state = {
            transitionNodes: [],
        }
    }

    static getDerivedStateFromProps(props, prevState) {
        const { flattenNodes = [], flattenList = [], motionType, motionKeys } = props;
        const hasChanged = !isEqual(prevState.cachedMotionKeys, motionKeys) ||
            !isEqual(prevState.cachedData.map(i => i.key), flattenNodes.map(i => i.key));
        if (!hasChanged)
            return null;

        const transitionNodes = [];
        const transitionRange = [];
        let rangeStart = -1;

        const lookUpTarget = motionType === 'hide' ? flattenList : flattenNodes;
        lookUpTarget.forEach((treeNode, index) => {
            const { key } = treeNode;
            if (motionKeys.has(key)) {
                transitionRange.push(treeNode);
                if (rangeStart === -1) {
                    rangeStart = index;
                }
            } else {
                transitionNodes.push(treeNode);
            }
        });

        transitionNodes.splice(rangeStart, 0, transitionRange);

        return {
            transitionNodes,
            cachedData: flattenNodes,
            cachedMotionKeys: motionKeys,
        }
    }

    onMotionEnd() {
        console.log('motion end');
        this.setState({ transitionNodes: [] });
    }

    renderAnimatie() {
        const { flattenNodes, renderTreeNode, motionType } = this.props;
        const { transitionNodes } = this.state;
        const mapData = transitionNodes.length ? transitionNodes : flattenNodes;

        const result = mapData.map(treeNode => {
            const isMotionNode = Array.isArray(treeNode);
            if (isMotionNode) {
                if (treeNode.length === 0)
                    return null;

                return (
                    <Collapse
                        motionType={motionType}
                        onMotionEnd={this.onMotionEnd.bind(this)}
                    >
                        {treeNode.map(node => renderTreeNode(node))}
                    </Collapse>
                )
            } else {
                return renderTreeNode(treeNode);
            }
        });

        return result;
    }

    render() {

        return (
            <div>
                {this.renderAnimatie()}
            </div>
        )
    }
}

export default NodeList;