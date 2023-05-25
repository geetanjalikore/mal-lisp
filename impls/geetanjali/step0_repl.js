const { stdin, stdout } = require("node:process");

const READ = (expression) => expression;
const EVAL = (expression) => expression;
const PRINT = (result) => stdout.write(result);

stdin.setEncoding('utf-8');
stdout.setEncoding('utf-8');

const rep = () => {
  const PROMPT = "user=> ";
  stdout.write(PROMPT);

  stdin.on('data', (chunck) => {
    PRINT(EVAL(READ(chunck)));
    stdout.write(PROMPT);
  });
}

rep();