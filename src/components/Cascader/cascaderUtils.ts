import { BasicCascaderData, BasicEntity } from './types';

function getPosition(pos: string, ind: number | undefined) {
    return pos + '-' + (ind || '');
}

export function convertDataToEntities(treeData: BasicCascaderData[]): { [x: string]: BasicEntity } {
    const keyEntities: any = {};

    traverseDataNodes(treeData, (data) => {
        const { key, parentKey } = data;
        const entity = { ...data };

        keyEntities[key] = entity;
        entity.parent = parentKey ? keyEntities[parentKey] : null;
        if (entity.parent) {
            entity.parent.children = entity.parent.children || [];
            entity.parent.children.push(entity);
        }
    })
    return keyEntities;
}

function traverseDataNodes(treeNodes: BasicCascaderData[], callback: (data: BasicEntity) => void) {
    const processNode = (node: BasicCascaderData | null, index?: number, parent?: BasicEntity) => {
        const children = node ? node.children : treeNodes;
        const pos = parent ? getPosition(parent.pos, index) : '0';
        let nxtParent: BasicEntity | undefined = undefined;

        if (node) {
            const data: BasicEntity = {
                key: node.key || pos,
                pos,
                parentKey: parent ? parent.key : null,
                data: { ...node },
                path: parent ? [...parent.path!, node.key] : [node.key],
                valuePath: parent ? [...parent.valuePath!, node.value] : [node.value]
            }

            nxtParent = data;
            callback(data);
        }

        if (children) {
            children.forEach((child: any, ind: number) => {
                processNode(child, ind, nxtParent);
            })
        }
    }

    processNode(null);
}

export function getRenderData(keyEntities: any) {
    return (Object.values(keyEntities) as BasicEntity[])
        .filter((entity: BasicEntity) => !entity.parentKey);
}