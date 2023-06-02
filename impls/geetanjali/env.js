const { MalSymbol } = require("./types");

class Env {
  #outer;
  data;
  constructor(outer, binds, expr) {
    this.#outer = outer;
    this.data = {};
    this.binds = binds;
    this.expr = expr;
    this.#bindExp();
  }

  #bindExp() {
    if (this.binds) {
      this.binds.forEach((bindSym, i) =>
        this.set(bindSym, this.expr[i]));
    }
  }

  set(symbol, malValue) {
    this.data[symbol.value] = malValue;
  }

  find(symbol) {
    if (this.data[symbol.value] !== undefined) return this;
    if (this.#outer) return this.#outer.find(symbol);
  }

  get(symbol) {
    const env = this.find(symbol);
    if (!env) throw `${symbol.value} not found`;
    return env.data[symbol.value];
  }
}

module.exports = { Env };