const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const READ = (expression) => expression;
const EVAL = (expression) => expression;
const PRINT = (result) => result;

const rep = str => PRINT(EVAL(READ(str)));

const repl = () => {
  rl.question('user> ', (line) => {
    console.log(rep(line));
    repl();
  })
}

repl();