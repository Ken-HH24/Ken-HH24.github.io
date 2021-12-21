import React from 'react';
import Cascader from './Cascader';
import { BasicCascaderData } from './types';

const treeData: BasicCascaderData[] = [
    {
        value: 'AAA',
        key: 'AAA',
        children: [
            {
                value: 'CCC',
                key: 'CCC'
            },
            {
                value: 'DDD',
                key: 'DDD'
            }
        ]
    },
    {
        value: 'BBB',
        key: 'BBB'
    },
    {
        value: 'kkk',
        key: 'kkk'
    }
]

const CascaderDemo = () => {
    return (
        <Cascader treeData={treeData} multiple />
    );
}

export default CascaderDemo;