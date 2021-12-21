import React, { useEffect } from 'react';

export default function useClickOutside(ref: React.RefObject<HTMLDivElement>, callback: Function) {
    useEffect(() => {
        const listener = (e: MouseEvent) => {
            if (ref.current?.contains(e.target as HTMLElement)) {
                return;
            }
            callback(e);
        }

        window.addEventListener('click', listener);
        return () => { window.removeEventListener('click', listener) }
    }, [callback, ref]);
}