const stream = require('stream');
const {EOL} = require('os');
class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.bf = '';
  }
  // Jesus Crist! OmG! 0_o`
  _transform(chunk, encoding, callback) {
    const push = (data) => {
      this.push(data);
    };
    const concat = (str) => {
      this.bf += str;
    };
    const clear = () => {
      this.bf = '';
    };
    const flush = (cb) => {
      this._flush(cb);
    };
    const str = chunk.toString();
    if (str.indexOf(EOL) !== -1) {
      const arr = str.split(EOL);
      let i = -1;
      for (const item of arr) {
        i++;
        if (this.bf) {
          push(new Buffer(this.bf + arr[i]));
          if (arr[i+1]) {
            clear();
            concat(arr[i+1]);
            return callback(null);
          }
        } else {
          push(new Buffer(arr[i]));
        }
      }
      return callback(null);
    } else {
      if (this.bf) {
        push(new Buffer(this.bf + str));
        return callback(null);
      }
      concat(str);
      flush(callback);
    }
  }

  _flush(callback) {
    callback();
  }
}

module.exports = LineSplitStream;
