const acorn = require('acorn');

const Parser = acorn.Parser;
const TokenType = acorn.TokenType;

Parser.acorn.keywordTypes['include'] = new TokenType('include', { keyword: 'include' });

function includeStatementPlugin(Parser) {
    return class extends Parser {
        parse(programme) {
            let newKeywords = "break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this const class extends export import super";
            newKeywords += ' include';
            this.keywords = new RegExp("^(?:" + newKeywords.replace(/ /g, "|") + ")$");
            return super.parse(programme);
        }

        parseStatement(context, toLevel, exports) {
            const tokenType = this.type;
            if (tokenType === Parser.acorn.keywordTypes['include']) {
                const node = this.startNode();
                this.next();
                return this.finishNode({ value: 'include' }, 'IncludeStatement');
            } else {
                return super.parseStatement(context, toLevel, exports);
            }
        }
    }
}

const newParser = Parser.extend(includeStatementPlugin);

const programme = `
    include
    const a = 1;
`

const ast = newParser.parse(programme);
console.log(ast);
// Node {
//     type: 'Program',
//     start: 0,
//     end: 30,
//     body: [
//       { value: 'include', type: 'IncludeStatement', end: 12 },
//       Node {
//         type: 'VariableDeclaration',
//         start: 17,
//         end: 29,
//         declarations: [Array],
//         kind: 'const'
//       }
//     ],
//     sourceType: 'script'
//   }