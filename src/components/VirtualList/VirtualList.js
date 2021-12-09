import React, { useState, useRef, useEffect } from 'react';
import './VirtualList.css';

const VirtualList = () => {
    const boxRef = useRef(null);
    const scrollRef = useRef(null);
    const contextRef = useRef(null);
    const [dataList, setDataList] = useState([]);
    const [position, setPosition] = useState([0, 0]);
    const scrollInfo = useRef({
        height: 500,
        itemHeight: 80,
        bufferCount: 8,
        renderCount: 0
    })

    useEffect(() => {
        const height = boxRef.current.offsetHeight;
        const { itemHeight, bufferCount } = scrollInfo.current;
        const renderCount = Math.ceil(height / itemHeight) + bufferCount;
        scrollInfo.current = ({ height, itemHeight, bufferCount, renderCount });

        const newDataList = new Array(10000).fill(1).map((item, index) => index + 1);
        setDataList(newDataList);
        setPosition([0, renderCount]);
    }, [])

    const handleScroll = () => {
        const scrollTop = scrollRef.current.scrollTop;
        const { renderCount, itemHeight } = scrollInfo.current;
        const start = Math.floor(scrollTop / itemHeight);
        const end = Math.floor(scrollTop / itemHeight + renderCount + 1);
        if (start !== position[0] || end !== position[1])
            setPosition([start, end]);

        const currentOffset = scrollTop - (scrollTop % itemHeight);
        contextRef.current.style.transform = `translate3d(0, ${currentOffset}px, 0)`;
    }

    const { height, itemHeight } = scrollInfo.current;
    const [start, end] = position;
    const renderList = dataList.slice(start, end);
    return (
        <div className='list_box' ref={boxRef}>
            <div className='scroll_box' style={{ height: `${height}px` }} ref={scrollRef} onScroll={handleScroll}>
                <div className='scroll_hold' style={{ height: `${dataList.length * itemHeight}px` }} />
                <div className='scroll_content' ref={contextRef}>
                    {
                        renderList.map(val => {
                            return (
                                <div key={val} className='list_item'>
                                    {val + ' '}item
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default VirtualList;