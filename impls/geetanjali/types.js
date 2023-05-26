class MalValue {
  constructor(value) {
    this.value = value;
  }

  pr_str() {
    return this.value.toString();
  }
};

class MalSymbol extends MalValue {
  constructor(symbol) {
    super(symbol);
  }
}

class MalList extends MalValue {
  constructor(value) {
    super(value);
  };

  pr_str() {
    return '(' + this.value.map(x => x.pr_str()).join(' ') + ')';
  }
}

class MalVector extends MalValue {
  constructor(value) {
    super(value);
  }

  pr_str() {
    return '[' + this.value.map(x => x.pr_str()).join(' ') + ']';
  }
};


class MalNil extends MalValue {
  constructor(value) {
    super(null);
  }

  pr_str() {
    return "nil";
  }
}
module.exports = { MalList, MalSymbol, MalValue, MalVector, MalNil };