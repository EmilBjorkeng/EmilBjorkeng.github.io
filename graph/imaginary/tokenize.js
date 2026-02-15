function tokenize(input) {
    const tokens = [];
    let i = 0;

    while (i < input.length) {
        let char = input[i];

        // Skip whitespace
        if (/\s/.test(char))
        { i++; continue; }

        // Numbers
        if (/[0-9.]/.test(char)) {
            let num = '';

            while (i < input.length && /[0-9.]/.test(input[i]))
            { num += input[i]; i++; }

            tokens.push({ type: 'NUMBER', value: num });
            continue;
        }

        // Text (Function names and variable)
        if (/[a-zA-Z]/.test(char)) {
            let name = '';
            while (i < input.length && /[a-zA-Z]/.test(input[i]))
            { name += input[i]; i++; }

            // Check if it is a function
            const functions = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan',
                             'sinh', 'cosh', 'tanh', 'sqrt', 'nRoot',
                             'log', 'ln', 'exp', 'abs', 'floor', 'ceil',
                             'round', 'min', 'max', 'atan2'];

            if (functions.includes(name)) {
                tokens.push({ type: 'FUNCTION', value: name });
            }
            // x is the only possible variable
            else if (name === 'x') {
                tokens.push({ type: 'VARIABLE', value: name });
            }
            // Constants
            else {
                if (name === 'e' || name === 'pi') {
                    tokens.push({ type: 'CONSTANT', value: name });
                } else {
                    throw new Error(`Unknown identifier: ${name}`);
                }
            }
            continue;
        }

        // Operators and parentheses
        if ('+-*/^(),'.includes(char)) {
            tokens.push({ type: char });
            i++;
            continue;
        }

        throw new Error(`Unexpected character: ${char}`);
    }

    return tokens;
}

class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.pos = 0;
    }

    peek() {
        return this.tokens[this.pos];
    }

    consume() {
        return this.tokens[this.pos++];
    }

    parse() {
        const result = this.parseAddSub();
        if (this.peek()) {
            throw new Error(`Unexpected token: ${this.peek().type}`);
        }
        return result;
    }

    // Addition and Subtraction
    parseAddSub() {
        let left = this.parseMulDiv();

        while (this.peek() && (this.peek().type === '+' || this.peek().type === '-')) {
            const op = this.consume().type;
            const right = this.parseMulDiv();
            left = { type: 'BinaryOp', op, left, right };
        }

        return left;
    }

    // Multiplication and Division
    parseMulDiv() {
        let left = this.parseImplicitMul();

        while (this.peek() && (this.peek().type === '*' || this.peek().type === '/')) {
            const op = this.consume().type;
            const right = this.parseImplicitMul();
            left = { type: 'BinaryOp', op, left, right };
        }

        return left;
    }

    // Implicit multiplication: 2x, 2(x+1), x(x+1)
    parseImplicitMul() {
        let left = this.parsePower();

        // Check for implicit multiplication
        while (this.peek()) {
            const next = this.peek();
            if ((next.type === 'VARIABLE' || next.type === 'FUNCTION' ||
                 next.type === '(' || next.type === 'NUMBER')) {
                const right = this.parsePower();
                left = { type: 'BinaryOp', op: '*', left, right };
            } else {
                break;
            }
        }

        return left;
    }

    parsePower() {
        let left = this.parsePrimary();

        if (this.peek() && this.peek().type === '^') {
            this.consume(); // Remove ^
            const right = this.parsePower(); // Right-associative
            return { type: 'Power', base: left, exponent: right };
        }

        return left;
    }

    // Numbers, Variables, Functions, Parentheses
    parsePrimary() {
        const token = this.peek();

        if (!token) {
            throw new Error('Unexpected end of input');
        }

        if (token.type === 'NUMBER') {
            this.consume();
            return { type: 'Number', value: token.value };
        }

        if (token.type === 'VARIABLE') {
            this.consume();
            return { type: 'Variable', name: token.value };
        }

        if (token.type === 'CONSTANT') {
            this.consume();
            return { type: 'Constant', name: token.value };
        }

        if (token.type === 'FUNCTION') {
            const funcName = this.consume().value;

            if (!this.peek() || this.peek().type !== '(') {
                throw new Error(`Expected '(' after function ${funcName}`);
            }
            this.consume(); // Remove '('

            const args = [];

            // Arguments (comma-separated)
            if (this.peek() && this.peek().type !== ')') {
                args.push(this.parseAddSub());

                while (this.peek() && this.peek().type === ',') {
                    this.consume(); // Remove ','
                    args.push(this.parseAddSub());
                }
            }

            if (!this.peek() || this.peek().type !== ')') {
                throw new Error('Expected closing parenthesis');
            }
            this.consume(); // Remove ')'

            return { type: 'Function', name: funcName, args };
        }

        // Parentheses
        if (token.type === '(') {
            this.consume(); // Remove '('
            const expr = this.parseAddSub();
            if (!this.peek() || this.peek().type !== ')') {
                throw new Error('Expected closing parenthesis');
            }
            this.consume(); // Remove ')'
            return expr;
        }

        // Unary minus
        if (token.type === '-') {
            this.consume();
            const operand = this.parsePrimary();
            return { type: 'UnaryOp', op: '-', operand };
        }

        // Unary plus
        if (token.type === '+') {
            this.consume();
            return this.parsePrimary();
        }

        throw new Error(`Unexpected token: ${token.type}`);
    }
}

function generateCode(node) {
    if (node.type === 'Number') {
        return node.value;
    }

    if (node.type === 'Variable') {
        return node.name;
    }

    if (node.type === 'Constant') {
        if (node.name === 'e') return 'Math.E';
        if (node.name === 'pi') return 'Math.PI';
        throw new Error(`Unknown constant: ${node.name}`);
    }

    if (node.type === 'BinaryOp') {
        const left = generateCode(node.left);
        const right = generateCode(node.right);

        return `(${left} ${node.op} ${right})`;
    }

    if (node.type === 'Power') {
        const base = generateCode(node.base);
        const exponent = generateCode(node.exponent);

        return `pow(${base}, ${exponent})`;
    }

    if (node.type === 'UnaryOp') {
        const operand = generateCode(node.operand);
        if (node.op === '-') return `(-${operand})`;
        throw new Error(`Unknown unary operator: ${node.op}`);
    }

    if (node.type === 'Function') {
        const args = node.args.map(arg => generateCode(arg)).join(', ');

        // Custom functions
        if (node.name === 'sqrt' || node.name === 'nRoot') {
            return `${node.name}(${args})`;
        }

        if (node.name === 'ln') {
            return `Math.log(${args})`;
        }

        if (node.name === 'log') {
            return `Math.log10(${args})`;
        }

        return `Math.${node.name}(${args})`;
    }

    throw new Error(`Unknown node type: ${node.type}`);
}

function transpile(expression) {
    const tokens = tokenize(expression);
    const parser = new Parser(tokens);
    const ast = parser.parse();
    return generateCode(ast);
}

export { tokenize, Parser, generateCode, transpile };
