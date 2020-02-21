const url = require('url');
const http = require('http');
const path = require('path');
const fsp = require('fs').promises;
const {ReadStream} = require('fs');

const server = new http.Server();


const r200 = (res, fileStream) => {
  fileStream.pipe(res);
  fileStream
      .on('error', (err) => r500(res) )
      .on('open', () => {
        console.log('open');
      })
      .on('close', () => {
        console.log('close');
      })
      .on('close', () => {
        fileStream.destroy();
      });
};

const r400 = (res) => {
  res.statusCode = 400;
  res.end('Bad Request!');
};

const r404 = (res) => {
  res.statusCode = 404;
  res.end('File not found!');
};

const r500 = (res) => {
  res.statusCode = 500;
  res.end('Internal Server Error ;_;');
};
const r501 = (res) => {
  res.statusCode = 501;
  res.end('Not implemented');
};


server.on('request', async (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const pathArray = pathname.split(/[\/\\]/igm);
  console.log(pathArray, '<<');
  if (pathArray.length > 1) return r400(res);

  const filepath = path.join(__dirname, 'files', pathname);

  let fileStat = null;
  try {
    fileStat= await fsp.stat(filepath);
  } catch (e) {
    if (e.message.indexOf('ENOENT') !== -1) return r404(res);
    else return r500(res);
  }
  const fileStream = ReadStream(filepath);
  switch (req.method) {
    case 'GET':
      r200(res, fileStream);
      break;
    default:
      return r501(res);
  }
});

module.exports = server;
