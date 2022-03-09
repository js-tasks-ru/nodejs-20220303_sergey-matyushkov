function sum(a, b) {
  if (typeof a === 'number' && typeof b === 'number') {
    return a + b;
  }

  throw new TypeError('Аргумент не число');
}

module.exports = sum;
