export default function compose(...funcs) {
    return funcs.reduce((prev, current) =>
        (...args) => prev(current(...args))
    )
}