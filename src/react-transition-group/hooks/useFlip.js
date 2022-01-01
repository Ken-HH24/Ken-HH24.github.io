import { useLayoutEffect, useRef } from 'react';

export default function useFlip({ root, flag }) {
    const origins = useRef({});
    const firstRun = useRef(true);

    useLayoutEffect(() => {
        const children = Array.prototype.slice.call(root.current.children);

        for (const child of children) {
            const key = child.dataset.key;
            const next = child.getBoundingClientRect();

            if (!firstRun.current) {
                const prev = origins.current[key];
                if (prev) {
                    const invert = {
                        left: prev.left - next.left,
                        top: prev.top - next.top
                    }

                    const keyframes = [
                        { transform: `translate(${invert.left}px, ${invert.top}px)` },
                        { transform: 'translate(0)' }
                    ]

                    const options = {
                        duration: 300,
                        easing: "cubic-bezier(0,0,0.32,1)",
                    }

                    requestAnimationFrame(() => {
                        child.animate(keyframes, options);
                    })
                }
            }

            origins.current[key] = next;
        }

        firstRun.current = false;
    }, [root, flag])
}