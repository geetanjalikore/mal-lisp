const assert = require('assert');
const fs = require('fs');
const { Env } = require("./env");
const { read_str } = require('./reader');
const { pr_str } = require("./printer");
const { MalList,
  MalNil,
  MalString,
  MalValue,
  MalSymbol,
  MalIterable,
  MalAtom } = require("./types");

const println = (...args) => {
  const result = args.reduce((res, arg) =>
    res.concat(pr_str(arg) + ' '), '');

  console.log(result);
  return new MalNil();
};

const areEqual = (args) => {
  try {
    assert.deepStrictEqual(...args);
    return true;
  } catch (error) {
    return false;
  }
};

const ns = {
  '+': (...args) => args.reduce((a, b) => a + b),
  '-': (...args) => args.reduce((a, b) => a - b),
  '*': (...args) => args.reduce((a, b) => a * b),
  '/': (...args) => args.reduce((a, b) => a / b),
  '>': (...args) => !(args.find((a, i) => (a >= args[i - 1]))),
  '<': (...args) => !(args.find((a, i) => (a <= args[i - 1]))),
  '>=': (...args) => !(args.find((a, i) => (a > args[i - 1]))),
  '<=': (...args) => !(args.find((a, i) => (a < args[i - 1]))),
  '=': (...args) => areEqual(args),
  'list': (...args) => new MalList(args),
  'list?': (lst) => lst instanceof MalList,
  'empty?': (lst) => lst?.isEmpty(),
  'count': (lst) => { return (lst instanceof MalIterable) ? lst?.count() : 0; },
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
  'println': println,
  'prn': println,
  'read-string': string => read_str(pr_str(string, false)),
  'slurp': fileName => new MalString(fs.readFileSync(fileName.value, 'utf-8')),
  'atom': value => {
    return new MalAtom(value);
  },
  'atom?': value => value instanceof MalAtom,
  'deref': atom => atom.deref(),
  'reset!': (atom, value) => atom.reset(value),
  'swap!': (atom, fn, ...args) => atom.swap(fn, args),
  'cons': (value, list) => new MalList([value, ...list.value]),
  'concat': (...lists) => new MalList(lists.flatMap(x => x.value)),
};

const env = new Env();
Object.entries(ns).forEach(([symbol, fn]) => env.set(new MalSymbol(symbol), fn));

module.exports = { ns, env };
