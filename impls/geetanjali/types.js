const pr_str = (malValue, readably = true) => {
  return malValue instanceof MalValue ? malValue.pr_str(readably) : malValue.toString();
};

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

  pr_str(readably) {
    return this.value.map(x => {
      return x instanceof MalValue ? pr_str(x, readably) : x;
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

  pr_str(readably) {
    return '(' + super.pr_str(readably) + ')';
  }

  beginsWith(symbol) {
    return this.value.length > 0 && this.value[0].value === symbol;
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

  pr_str(readably) {
    if (readably) {
      return `"${this.value
        .replace(/\\/g, "\\\\")
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')}"`;
    }
    return this.value;
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
  constructor(fnBody, params, env, fn) {
    super(fnBody);
    this.params = params;
    this.env = env;
    this.fn = fn;
  }

  pr_str() {
    return "#<function>";
  }

  apply(_, args) {
    console.log(args);
    return this.fn.apply(null, args);
  }
}

class MalAtom extends MalValue {
  constructor(value) {
    super(value);
  }

  pr_str() {
    return '(atom ' + this.value + ')';
  }

  deref() {
    return this.value;
  }

  reset(value) {
    this.value = value;
    return this.value;
  }

  swap(fn, args) {
    this.value = fn.apply(null, [this.value, ...args]);
    console.log({ fn, args, val: this.value });
    return this.value;
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
  MalAtom,
  pr_str
};