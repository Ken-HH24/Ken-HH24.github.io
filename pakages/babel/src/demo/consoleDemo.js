const types = require('@babel/types');
const parser = require('@babel/parser');
const template = require('@babel/template');
const { transformFileSync } = require('@babel/core');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const consoleMarkPlugin = require('../plugin/consoleMarkPlugin.js');
const path = require('path');

const sourceCode = `
    console.log(1);

    function func() {
        console.info(2);
    }

    export default class Clazz {
        say() {
            console.debug(3);
        }
        render() {
            return <div>{console.error(4)}</div>
        }
    }
`;

const ast = parser.parse(sourceCode, {
    sourceType: 'unambiguous',
    plugins: ['jsx']
})

const consoleCalleeNames = ['log', 'error', 'info', 'debug'].map(arg => `console.${arg}`)

// version 1
// traverse(ast, {
//     CallExpression(path, state) {
//         const calleeName = generate(path.node.callee).code;
//         if (consoleCalleeNames.includes(calleeName)) {
//             const { line, column } = path.node.loc.start;
//             path.node.arguments.unshift(types.stringLiteral(`filename (${line}, ${column})`))
//         }
//     }
// })

// version 2
// traverse(ast, {
//     CallExpression(path) {
//         if (path.node.isNew)
//             return;

//         const calleeName = generate(path.node.callee).code;
//         if (consoleCalleeNames.includes(calleeName)) {
//             const { line, column } = path.node.loc.start;
//             const newNode = template.expression(`console.log('filename (${line}, ${column})')`)();
//             newNode.isNew = true;

//             // JSX
//             if (path.findParent(path => path.isJSXElement())) {
//                 path.replaceWith(types.arrayExpression([newNode, path.node]));
//                 path.skip();
//             } else {
//                 path.insertBefore(newNode);
//             }
//         }
//     }
// })

// const { code, map } = generate(ast);

// version3
const { code } = transformFileSync(path.join(__dirname, './sourceCode.js'), {
    plugins: [consoleMarkPlugin],
    parserOpts: {
        sourceType: 'unambiguous',
        plugins: ['jsx']
    }
})

console.log(code);