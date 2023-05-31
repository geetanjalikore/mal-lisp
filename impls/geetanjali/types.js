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

  isEmpty() {
    return this.value.length === 0;
  }
}

class MalVector extends MalValue {
  constructor(value) {
    super(value);
  }

  pr_str() {
    return '[' + this.value.map(x => {
      if (x instanceof MalValue) {
        return x.pr_str();
      }
      return x;
    }).join(' ') + ']';
  }
};


class MalNil extends MalValue {
  constructor() {
    super(null);
  }

  pr_str() {
    return "nil";
  }
}

class MalHashmap extends MalValue {
  constructor(value) {
    super(value)
  }

  pr_str() {
    return
  }
}

module.exports = { MalList, MalSymbol, MalValue, MalVector, MalNil };