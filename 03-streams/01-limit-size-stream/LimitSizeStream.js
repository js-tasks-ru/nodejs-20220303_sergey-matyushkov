const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.limit = options.limit;
    this.count = 0;
  }

  isExeeded(add) {
    this.count += add;
    return this.count > this.limit;
  }

  _transform(chunk, encoding, callback) {
    if (this.isExeeded(chunk.length)) {
      callback(new LimitExceededError()); // this.emit('error', new LimitExceededError());
      return;
    }

    callback(null, chunk);
  }
}

module.exports = LimitSizeStream;
