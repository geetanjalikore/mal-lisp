const readline = require("readline");
const { read_str } = require("./reader.js");
const { pr_str } = require("./printer");
const { Env } = require("./env.js");
const { MalSymbol, MalList, MalVector, MalNil } = require("./types.js");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

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
};

const bindDef = (ast, env) => {
  env.set(ast.value[1], EVAL(ast.value[2], env));
  return env.get(ast.value[1]);
}

const bindLet = (ast, env) => {
  const lexicalEnv = new Env(env);
  const bindingList = ast.value[1].value;

  for (let i = 0; i < bindingList.length; i += 2)
    lexicalEnv.set(bindingList[i], EVAL(bindingList[i + 1], lexicalEnv));

  const expr = ast.value.slice(2);
  if (expr) {
    const result = EVAL((new MalVector(expr)), lexicalEnv).value;
    return result[result.length - 1];
  }

  return new MalNil();
};

const evalDo = (ast, env) => {
  const result = ast.value.slice(1).map(exp => EVAL(exp, env));
  return result[result.length - 1];
};

const evalPrint = (ast, env) => {
  const result = ast.value.slice(1).reduce((res, exp) =>
    res.concat(pr_str(EVAL(exp, env)), ' '), '');
  console.log(result);
  return new MalNil();
};

const evalIF = (ast, env) => {
  const [condExp, exp1, exp2] = ast.value.slice(1);

  const res = EVAL(condExp, env);
  return (res === false || res instanceof MalNil) ?
    EVAL(exp2, env) : EVAL(exp1, env);
};

const READ = (expression) => read_str(expression);

const EVAL = (ast, env) => {
  if (!(ast instanceof MalList)) return eval_ast(ast, env);
  if (ast.isEmpty()) return ast;
  const bindingFn = ast.value[0].value;

  switch (bindingFn) {
    case 'def!': return bindDef(ast, env);
    case 'let*': return bindLet(ast, env);
    case 'do': return evalDo(ast, env);
    case 'println': return evalPrint(ast, env);
    case 'if': return evalIF(ast, env);
  }

  const [fn, ...args] = eval_ast(ast, env).value;
  return fn.apply(null, args);
};

const PRINT = (malValue) => pr_str(malValue);

const operate = operator => (...args) => args.reduce(operator);

const env = new Env();
env.set(new MalSymbol('+'), operate((a, b) => a + b));
env.set(new MalSymbol('-'), operate((a, b) => a - b));
env.set(new MalSymbol('*'), operate((a, b) => a * b));
env.set(new MalSymbol('/'), operate((a, b) => a / b));
env.set(new MalSymbol('list'), (...args) => new MalList(args));
env.set(new MalSymbol('list?'), (lst) => lst instanceof MalList);

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
