const readline = require("readline");
const { read_str } = require("./reader.js");
const { pr_str } = require("./printer");
const { Env } = require("./env.js");
const { env } = require("./core.js");
const { MalSymbol,
  MalList,
  MalVector,
  MalNil,
  MalFunction, } = require("./types.js");

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

  const doExpr = new MalList(new MalSymbol('do'), ...ast.value.slice(2));
  return [doExpr, lexicalEnv];
};

const evalDo = (ast, env) => {
  const forms = ast.value.slice(1);
  forms.slice(0, -1).forEach(exp => EVAL(exp, env));
  return forms[forms.length - 1];
};

const evalIF = (ast, env) => {
  const [condExp, exp1, exp2] = ast.value.slice(1);

  const res = EVAL(condExp, env);
  return (res === false || res instanceof MalNil) ? exp2 : exp1;
};

const bindFunction = (ast, env) => {
  const [paramList, ...fnBody] = ast.value.slice(1);
  const doForms = new MalList([new MalSymbol('do'), ...fnBody]);
  return new MalFunction(doForms, paramList, env);
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
  while (true) {
    if (!(ast instanceof MalList)) return eval_ast(ast, env);
    if (ast.isEmpty()) return ast;
    const bindingFn = ast.value[0].value;

    switch (bindingFn) {
      case 'def!': return bindDef(ast, env);
      case 'let*':
        [ast, env] = bindLet(ast, env);
        break;
      case 'do':
        ast = evalDo(ast, env);
        break;
      case 'if':
        ast = evalIF(ast, env);
        break;
      case 'fn*':
        ast = bindFunction(ast, env);
        break;
      default:
        const [fn, ...args] = eval_ast(ast, env).value;
        if (fn instanceof MalFunction) {
          const fnScope = new Env(fn.env, fn.params.value, args);
          ast = fn.value;
          env = fnScope;
        } else {
          return fn.apply(null, args);
        }
    }
  }
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
