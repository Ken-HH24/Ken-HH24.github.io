const consoleCalleeNames = ['log', 'error', 'info', 'debug'].map(arg => `console.${arg}`)

module.exports = function consoleMarkPlugin({ types, template }) {
    return {
        visitor: {
            CallExpression(path) {
                if (path.node.isNew)
                    return;

                const calleeName = path.get('callee').toString();
                if (consoleCalleeNames.includes(calleeName)) {
                    const { line, column } = path.node.loc.start;
                    const newNode = template.expression(`console.log('filename (${line}, ${column})')`)();
                    newNode.isNew = true;

                    // JSX
                    if (path.findParent(path => path.isJSXElement())) {
                        path.replaceWith(types.arrayExpression([newNode, path.node]));
                        path.skip();
                    } else {
                        path.insertBefore(newNode);
                    }
                }
            }
        }
    }
}