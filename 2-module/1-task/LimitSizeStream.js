const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit;
    this.totalSize = 0;
  }

  _transform(chunk, encoding, callback) {
    this.totalSize += chunk.length;
    let err = null;
    if (this.totalSize >= this.limit) err = new LimitExceededError();
    callback(err, chunk);
  }
}

module.exports = LimitSizeStream;
