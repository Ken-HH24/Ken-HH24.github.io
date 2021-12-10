import React, { useState } from 'react';

const getFocusNode = () => {
    const selection = window.getSelection();
    return selection?.focusNode;
}

const getCursorIndex = () => {
    const selection = window.getSelection();
    return selection?.focusOffset;
}

const getAtUser = () => {
    const focusNode = getFocusNode();
    const textContent = focusNode?.textContent || '';
    const regx = /@([^@\s]*)$/;
    const match = regx.exec(textContent.slice(0, getCursorIndex()));
    if (match && match.length === 2)
        return match[1];

    return undefined;
}

const getPosition = () => {
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0)!;
    const rect = range.getClientRects()[0];
    const LINE_HEIGHT = 30;
    return {
        x: rect.x,
        y: rect.y + LINE_HEIGHT
    }
}

const showAt = () => {
    const focusNode = getFocusNode();
    if (!focusNode || focusNode.nodeType !== Node.TEXT_NODE)
        return false;
    const textContent = focusNode?.textContent || '';
    const regx = /@([^@\s]*)$/;
    const match = regx.exec(textContent.slice(0, getCursorIndex()));
    return match && match.length === 2;
}

const Editor = () => {
    const [showAtPanel, setShowAtPanel] = useState(false);
    const [queryUser, setQueryUser] = useState('');
    const [position, setPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });

    new Animation()
    const handleKeyUp = () => {
        if (showAt()) {
            const position = getPosition();
            setPosition(position);
            setShowAtPanel(true);
        } else {
            setShowAtPanel(false);
        }
    }

    return (
        <div
            className='editor'
            contentEditable
            onKeyUp={handleKeyUp}
        >

        </div>
    )
}

export default Editor;