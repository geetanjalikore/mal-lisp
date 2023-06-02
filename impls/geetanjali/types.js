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

class MalIterable extends MalValue {
  constructor(value) {
    super(value);
  }

  pr_str() {
    return this.value.map(x => {
      return x instanceof MalValue ? x.pr_str() : x;
    }).join(' ');
  }

  isEmpty() {
    return this.value.length === 0;
  }

  count() {
    return this.value.length;
  }
}

class MalList extends MalIterable {
  constructor(value) {
    super(value);
  };

  pr_str() {
    return '(' + super.pr_str() + ')';
  }
}

class MalVector extends MalIterable {
  constructor(value) {
    super(value);
  }

  pr_str() {
    return '[' + super.pr_str() + ']';
  }
};

class MalHashmap extends MalValue {
  constructor(value) {
    super(value);
  }

  pr_str() {
    let res = '';
    for (let i = 0; i < this.value.length; i += 2) {
      res += `:${this.value[i].value} ${this.value[i + 1]} `;
    }
    return `{${res}}`;
  }

  isEmpty() {
    return this.value.length === 0;
  }

  count() {
    return this.value.length / 2;
  }
};

class MalString extends MalValue {
  constructor(value) {
    super(value);
  }

  pr_str() {
    return `"${this.value}"`;
  }
}

class MalNil extends MalValue {
  constructor() {
    super(null);
  }

  pr_str() {
    return "nil";
  }
}

class MalFunction extends MalValue {
  constructor(fnBody, params, env) {
    super(fnBody);
    this.params = params;
    this.env = env;
  }
  pr_str() {
    return "#<function>";
  }
}

module.exports = {
  MalList,
  MalSymbol,
  MalValue,
  MalVector,
  MalNil,
  MalString,
  MalHashmap,
  MalFunction,
  MalIterable,
};