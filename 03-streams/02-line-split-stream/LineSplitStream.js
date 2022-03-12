const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.buffer = '';
  }

  fillBuffer(data) {
    this.buffer = this.buffer + data;
  }

  clearBuffer() {
    this.buffer = '';
  }

  pushBuffer() {
    this.push(this.buffer);
    this.clearBuffer();
  }

  flushBuffer() {
    this.pushBuffer();
    this.clearBuffer();
  }

  _transform(chunk, encoding, callback) {
    const str = chunk.toString();

    for (let i = 0; i < str.length; i++) {
      if (str.charAt(i) === os.EOL) {
        this.pushBuffer();
      } else {
        this.fillBuffer(str.charAt(i));
      }
    }

    callback();
  }

  _flush(callback) {
    this.flushBuffer();
    callback();
  }
}

module.exports = LineSplitStream;
