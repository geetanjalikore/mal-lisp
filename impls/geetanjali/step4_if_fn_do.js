const readline = require("readline");
const { read_str } = require("./reader.js");
const { pr_str } = require("./printer");
const { Env } = require("./env.js");
const { MalSymbol, MalList, MalVector, MalNil, MalString } = require("./types.js");
const { ns } = require("./core.js");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

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

const evalIF = (ast, env) => {
  const [condExp, exp1, exp2] = ast.value.slice(1);

  const res = EVAL(condExp, env);
  return (res === false || res instanceof MalNil) ?
    EVAL(exp2, env) : EVAL(exp1, env);
};

const bindFunction = (ast, env) => {
  return (...parameters) => {
    const fnScope = new Env(env);
    const paramList = ast.value[1].value;
    paramList.forEach(
      (symbol, i) => fnScope.set(symbol, EVAL(parameters[i], env)));

    return EVAL(ast.value[2], fnScope);
  };
};

const READ = (expression) => read_str(expression);

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

const EVAL = (ast, env) => {
  if (!(ast instanceof MalList)) return eval_ast(ast, env);
  if (ast.isEmpty()) return ast;
  const bindingFn = ast.value[0].value;

  switch (bindingFn) {
    case 'def!': return bindDef(ast, env);
    case 'let*': return bindLet(ast, env);
    case 'do': return evalDo(ast, env);
    case 'if': return evalIF(ast, env);
    case 'fn*': return bindFunction(ast, env);
  }

  const [fn, ...args] = eval_ast(ast, env).value;
  return fn.apply(null, args);
};

const PRINT = (malValue) => pr_str(malValue);

const env = new Env();
Object.entries(ns).forEach(([symbol, fn]) => env.set(new MalSymbol(symbol), fn));

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
