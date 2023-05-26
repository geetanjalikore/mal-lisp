const readline = require("readline");
const { read_str } = require("./reader.js");
const { pr_str } = require("./printer");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const READ = (expression) => read_str(expression);
const EVAL = (expression) => expression;
const PRINT = (malValue) => pr_str(malValue);

const rep = str => PRINT(EVAL(READ(str)));

const repl = () => {
  rl.question('user> ', (line) => {
    console.log(rep(line));
    repl();
  })
}

repl();