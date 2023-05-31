class Env {
  #outer;
  data;
  constructor(outer, binds) {
    this.#outer = outer;
    this.data = {};
    this.bindParameters(binds);
  }

  bindParameters(binds) {
    if (binds) {
      binds.forEach(bind => this.data[bind]);
    }
  }

  set(symbol, malValue) {
    this.data[symbol.value] = malValue;
  }

  find(symbol) {
    if (this.data[symbol.value]) return this;
    if (this.#outer) return this.#outer.find(symbol);
  }

  get(symbol) {
    const env = this.find(symbol);
    if (!env) throw `${symbol.value} not found`;
    return env.data[symbol.value];
  }
}

module.exports = { Env };