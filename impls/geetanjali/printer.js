const { MalValue } = require("./types");

const pr_str = malValue => {
  if (Array.isArray(malValue))
    '(' + malValue.map(pr_str).join(' ') + ')';

  if (malValue instanceof MalValue) return malValue.pr_str();

  return malValue.toString();
};

module.exports = { pr_str };
