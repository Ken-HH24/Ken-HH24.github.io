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
            entities: {},
            dragging: false,
            dragNodeKeys: new Set()
        }

        this.foundation = new TreeFoundation(this.adapter);
    }

    static getDerivedStateFromProps(props, prevState) {
        const { expandedKeys } = prevState;

        const entities = convertDataToEntities(prevState.treeData || props.treeData, expandedKeys);
        const flattenNodes = flattenTreeData(prevState.treeData || props.treeData, expandedKeys);

        const newState = {
            treeData: prevState.treeData || props.treeData,
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
            },

            setDragNode: (treeNode) => {
                this.dragNode = treeNode;
            }
        }
    }

    onNodeExpand(e, treeNode) {
        this.foundation.handleNodeExpand(e, treeNode);
    }

    onNodeDragStart(e, treeNode) {
        this.foundation.handleNodeDragStart(e, treeNode);
    }

    onNodeDragEnter(e, treeNode) {
        this.foundation.handNodeDragEnter(e, treeNode, this.dragNode);
    }

    onNodeDragOver(e, treeNode) {
        this.foundation.handleNodeDragOver(e, treeNode, this.dragNode);
    }

    onNodeDragLeave(e, treeNode) {
        this.foundation.handleNodeDragLeave(e, treeNode);
    }

    onNodeDragEnd(e, treeNode) {
        this.foundation.handleNodeDragEnd(e, treeNode);
    }

    onNodeDrop(e, treeNode) {
        this.foundation.handleNodeDrop(e, treeNode, this.dragNode);
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
        const { draggable } = this.props;

        const {
            entities,
            motionType,
            motionKeys,
            expandedKeys,
            flattenNodes,
            dropPosition,
            dragOverNodeKey,
            cachedFlattenNodes
        } = this.state;

        return (
            <TreeContext.Provider
                value={{
                    entities,
                    draggable,
                    expandedKeys,
                    dropPosition,
                    dragOverNodeKey,
                    onNodeExpand: this.onNodeExpand.bind(this),
                    onNodeDragStart: this.onNodeDragStart.bind(this),
                    onNodeDragEnter: this.onNodeDragEnter.bind(this),
                    onNodeDragOver: this.onNodeDragOver.bind(this),
                    onNodeDragLeave: this.onNodeDragLeave.bind(this),
                    onNodeDragEnd: this.onNodeDragEnd.bind(this),
                    onNodeDrop: this.onNodeDrop.bind(this)
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