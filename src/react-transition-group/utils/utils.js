import React from 'react';

function getChildrenMapping(children, callback = (c) => c) {
    const result = Object.create(null);

    React.Children.forEach(children, (c) => {
        result[c.key] = callback(c)
    })

    return result;
}

function mergeMappings(prev, next) {
    const prevLen = Object.keys(prev).length;
    const nextLen = Object.keys(next).length;

    return prevLen > nextLen ? prev : next;
}

export function getInitialChildMapping(children) {
    return getChildrenMapping(children, (c) => React.cloneElement(c, { in: true }));
}

export function getNextChildMapping(nextProps, prevChildrenMapping, handleExited) {
    const result = Object.create(null);

    const nextChildren = nextProps.children;
    const nextChildrenMapping = getChildrenMapping(nextChildren);

    const mergeMapping = mergeMappings(prevChildrenMapping, nextChildrenMapping);

    Object.keys(mergeMapping).forEach(key => {
        const isPrev = key in prevChildrenMapping;
        const isNext = key in nextChildrenMapping;

        if (isNext && !isPrev) {
            result[key] = React.cloneElement(nextChildrenMapping[key], {
                in: true
            })
        }

        if (!isNext && isPrev) {
            result[key] = React.cloneElement(prevChildrenMapping[key], {
                in: false,
                onExited: () => {
                    console.log('on Exited');
                    handleExited(prevChildrenMapping[key])
                }
            })
        }

        if (isNext && isPrev) {
            result[key] = React.cloneElement(nextChildrenMapping[key], {
                in: true
            })
        }
    })

    return result;
}