const readline = require("readline");
const { read_str } = require("./reader.js");
const { pr_str } = require("./printer");
const { MalSymbol, MalList, MalValue, MalVector } = require("./types.js");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const operate = operator => (...args) =>
  new MalValue(args.slice(1).reduce(operator, args[0]));

const env = {
  '+': operate((a, b) => a + b),
  '-': operate((a, b) => a - b),
  '*': operate((a, b) => a * b),
  '/': operate((a, b) => a / b),
};

const eval_ast = (ast, env) => {
  if (ast instanceof MalSymbol) return env[ast.value];

  if (ast instanceof MalList) {
    const evaluatedList = ast.value.map(x => EVAL(x, env));
    return new MalList(evaluatedList);
  }

  if (ast instanceof MalVector) {
    const newVector = ast.value.map(x => EVAL(x, env));

    return new MalVector(newVector);
  }
  return ast;
}

const READ = (expression) => read_str(expression);

const EVAL = (ast, env) => {
  if (!(ast instanceof MalList)) return eval_ast(ast, env);
  if (ast.isEmpty()) return ast;

  const [fn, ...args] = eval_ast(ast, env).value;
  return fn.apply(null, args.map((x) => x.value));
};

const PRINT = (malValue) => pr_str(malValue);

const rep = str => PRINT(EVAL(READ(str), env));

const repl = () => {
  rl.question('user> ', (line) => {
    try {
      console.log(rep(line));
    } catch (e) {
      console.log(e);
    }
    repl();
  })
}

repl();