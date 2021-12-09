import React from 'react';
import Tree from './Tree';

const treeData = [
    {
        label: '亚洲',
        value: 'Asia',
        key: '0',
        children: [
            {
                label: '中国',
                value: 'China',
                key: '0-0',
                children: [
                    {
                        label: '北京',
                        value: 'Beijing',
                        key: '0-0-0',
                    },
                    {
                        label: '上海',
                        value: 'Shanghai',
                        key: '0-0-1',
                    },
                ],
            },
            {
                label: '日本',
                value: 'Japan',
                key: '0-1',
            },
            {
                label: '印度',
                value: 'India',
                key: '0-2'
            }
        ],
    },
    {
        label: '北美洲',
        value: 'North America',
        key: '1',
    }
];

const TreeDemo = () => {
    return <Tree treeData={treeData} />
}

export default TreeDemo;