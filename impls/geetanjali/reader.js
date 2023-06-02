const { MalSymbol, MalValue, MalList, MalVector, MalNil, MalString } = require("./types");

class Reader {
  constructor(tokens) {
    this.tokens = tokens;
    this.position = 0;
  }

  peek() {
    return this.tokens[this.position];
  }

  next() {
    const token = this.peek();
    this.position++;
    return token;
  }
}

const tokenize = str => {
  const regEx =
    /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"?|;.*|[^\s\[\]{}('"`,;)]*)/g;

  return [...str.matchAll(regEx)].map(x => x[1]);
};

const read_seq = (reader, close) => {
  const ast = [];

  reader.next();
  while (reader.peek() !== close) {
    if (reader.peek() === undefined) throw "unbalanced";

    ast.push(read_form(reader));
  }

  reader.next();
  return ast;
};

const read_vector = reader => new MalVector(read_seq(reader, ']'));

const read_list = reader => new MalList(read_seq(reader, ')'));

const read_atom = reader => {
  const token = reader.next();
  const digit = /^-?[0-9]+$/;

  if (token.match(digit)) return parseInt(token);
  if (token === 'nil') return new MalNil();
  if (token === 'true') return true;
  if (token === 'false') return false;
  if (token.startsWith('"')) {
    console.log('token', token.slice(1, -1));
    return new MalString(token.slice(1, -1))
  };

  return new MalSymbol(token);
};

const read_form = reader => {
  const token = reader.peek();

  switch (token) {
    case '(': return read_list(reader);
    case '[': return read_vector(reader);
    default: return read_atom(reader);
  }
};

const read_str = str => {
  const tokens = tokenize(str);
  const reader = new Reader(tokens);
  return read_form(reader);
};

module.exports = { read_str };