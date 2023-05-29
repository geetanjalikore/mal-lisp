const readline = require("readline");
const { read_str } = require("./reader.js");
const { pr_str } = require("./printer");
const { MalSymbol, MalList, MalValue, MalVector } = require("./types.js");
const { Env } = require("./env.js");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const operate = operator => (...args) => args.reduce(operator);

const _env = {
  '+': operate((a, b) => a + b),
  '-': operate((a, b) => a - b),
  '*': operate((a, b) => a * b),
  '/': operate((a, b) => a / b),
};

const eval_ast = (ast, env) => {
  if (ast instanceof MalSymbol) return env.get(ast);

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
  console.log(ast);
  if (!(ast instanceof MalList)) return eval_ast(ast, env);
  if (ast.isEmpty()) return ast;

  switch (ast.value[0].value) {
    case 'def!':
      env.set(ast.value[1], EVAL(ast.value[2], env));
      return env.get(ast.value[1]);
    case 'let*':
      const lexicalEnv = new Env(env);
      const bindingList = ast.value[1].value;

      for (let i = 0; i < bindingList.length; i += 2) {
        lexicalEnv.set(bindingList[i], EVAL(bindingList[i + 1], lexicalEnv));
      }
      if (ast.value[2]) {
        return EVAL(ast.value[2], lexicalEnv);
      }
      return;
  }

  const [fn, ...args] = eval_ast(ast, env).value;
  return fn.apply(null, args);
};

const PRINT = (malValue) => pr_str(malValue);

const env = new Env();
env.set(new MalSymbol('+'), operate((a, b) => a + b));
env.set(new MalSymbol('-'), operate((a, b) => a - b));
env.set(new MalSymbol('*'), operate((a, b) => a * b));
env.set(new MalSymbol('/'), operate((a, b) => a / b));

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