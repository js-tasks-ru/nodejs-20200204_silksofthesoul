const url = require('url');
const http = require('http');
const path = require('path');

const fsp = require('fs').promises;

const {unlinkSync} = require('fs');

const server = new http.Server();

const obj = {
  filepath: '',
};

obj.responses = (ctx) => {
  const {code, res} = ctx;
  const responses = {
    '201': (r) => {
      r.statusCode = code; r.end('Success+ (caffeine free)!');
    },
    '200': (r) => {
      r.statusCode = code; r.end('Success!');
    },
    '400': (r) => {
      r.statusCode = code; r.end('Bad Request!');
    },
    '404': (r) => {
      r.statusCode = code; r.end('File not found!');
    },
    '409': (r) => {
      r.statusCode = code; r.end('File already exists!');
    },
    '413': (r) => {
      r.statusCode = code; r.end('File is too big!');
    },
    '500': (r, err = new Error()) => {
      throw err;
      r.statusCode = code; r.end('Internal Server Error');
    },
    '501': (r) => {
      r.statusCode = code; r.end('Not implemented');
    },
  };
  if (!Object.keys(responses).includes(code)) {
    return responses['500'](res, new Error(`Unknow status ${code}`));
  }
  return responses[code](res);
};


obj.deleteFile = (ctx) => {
  const {filePath = obj.filepath} = ctx;
  return new Promise(function(resolve, reject) {
    try {
      unlinkSync(filePath);
    } catch (e) {
      return resolve('500');
    }
    return resolve('200');
  });
};


obj.getFilePathFromReq = (req) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const pathArray = pathname.split(/[\/\\]/igm);
  if (pathArray.length > 1) return '400';
  if (!pathname) return '400';
  obj.filepath = path.join(__dirname, 'files', pathname);
  return '200';
};

obj.isFileExist = async (_filePath=null) => {
  const filePath = _filePath||obj.filepath;
  let fileStat = null;
  try {
    fileStat = await fsp.stat(filePath);
  } catch (e) {
    if (e.message.indexOf('ENOENT') !== -1) return '404';
  }
  if (fileStat) return '200';
};

server.on('request', async (req, res) => {
  let status = '';

  status = obj.getFilePathFromReq(req);
  if (status !== '200') return obj.responses({code: status, res});

  status = await obj.isFileExist(obj.filepath);
  if (status !== '200') return obj.responses({code: status, res});

  status = await obj.deleteFile({res, req, filePath: obj.filepath});
  if (status !== '200') return obj.responses({code: status, res});

  switch (req.method) {
    case 'DELETE':
      obj.responses({code: '200', res});
      break;
    default:
      obj.responses({code: '501', res});
  }
});

module.exports = server;
