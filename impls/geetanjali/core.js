const { MalList, MalNil, MalString, MalVector, MalValue } = require("./types");

const ns = {
  '+': (...args) => args.reduce((a, b) => a + b),
  '-': (...args) => args.reduce((a, b) => a - b),
  '*': (...args) => args.reduce((a, b) => a * b),
  '/': (...args) => args.reduce((a, b) => a / b),
  '>': (...args) => !(args.find((a, i) => (a >= args[i - 1]))),
  '<': (...args) => !(args.find((a, i) => (a <= args[i - 1]))),
  '>=': (...args) => !(args.find((a, i) => (a > args[i - 1]))),
  '<=': (...args) => !(args.find((a, i) => (a < args[i - 1]))),
  '=': (...args) => !(args.find(a => a == args[0])),
  'list': (...args) => new MalList(args),
  'list?': (lst) => lst instanceof MalList,
  'empty?': (lst) => lst?.isEmpty(),
  'count': (lst) => { return (lst instanceof MalList) ? lst?.count() : 0; },
  'not': (arg) => {
    if (arg === 0) return false;
    if (arg instanceof MalNil) return true;
    return !arg
  },
  'str': (...args) => {
    const res = args.reduce((r, a) => {
      if (a instanceof MalString) return r + a.value;

      if (a instanceof MalValue) return r + a.pr_str();

      return r + a;
    }, '');

    return new MalString(res);
  },
};

module.exports = { ns };
