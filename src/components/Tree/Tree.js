import React from 'react';
import { convertDataToEntities, flattenTreeData, getTreeNodeProps } from './treeUtils';
import TreeContext from './treeContext';
import NodeList from './NodeList';
import TreeNode from './TreeNode';
import TreeFoundation from './TreeFoundation';


class Tree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expandedKeys: new Set(),
            flattenNodes: [],
            cachedFlattenNodes: [],
            keyEntities: {},
            posEntities: {},
            motionType: '',
            motionKeys: new Set(),
            entities: {}
        }

        this.foundation = new TreeFoundation(this.adapter);
    }

    static getDerivedStateFromProps(props, prevState) {
        const { treeData } = props;
        const { expandedKeys } = prevState;

        const entities = convertDataToEntities(treeData, expandedKeys);
        const flattenNodes = flattenTreeData(treeData, expandedKeys);

        const newState = {
            entities: entities,
            keyEntities: entities.keyEntities,
            posEntities: entities.posEntities,
            flattenNodes,
            cachedFlattenNodes: prevState.flattenNodes
        }

        return newState;
    }

    get adapter() {
        return {
            getState: (key) => {
                return this.state[key];
            },

            getStates: () => {
                return this.state;
            },

            updateState: (states, cb) => {
                return this.setState({ ...states }, cb);
            }
        }
    }

    onNodeExpand(e, treeNode) {
        this.foundation.handleNodeExpand(e, treeNode);
    }

    renderTreeNode(treeNode) {
        const { data } = treeNode;
        const { key } = data;
        const { keyEntities, expandedKeys } = this.state;
        const treeNodeProps = getTreeNodeProps(treeNode, {
            keyEntities,
            expandedKeys
        });

        return <TreeNode {...treeNodeProps} {...data} key={key} data={data} />
    }

    render() {
        const {
            entities,
            motionType,
            motionKeys,
            expandedKeys,
            flattenNodes,
            cachedFlattenNodes
        } = this.state;

        return (
            <TreeContext.Provider
                value={{
                    entities,
                    expandedKeys,
                    onNodeExpand: this.onNodeExpand.bind(this)
                }}
            >
                <NodeList
                    motionType={motionType}
                    motionKeys={motionKeys}
                    flattenNodes={flattenNodes}
                    flattenList={cachedFlattenNodes}
                    renderTreeNode={this.renderTreeNode.bind(this)}
                />
            </TreeContext.Provider>
        )
    }
}

export default Tree;