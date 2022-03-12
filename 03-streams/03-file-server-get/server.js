// const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  if (/\//.test(pathname)) {
    res.statusCode = 400;
    res.end('Not support nested folders');
    return;
  }

  const filepath = path.join(__dirname, 'files', pathname);

  if (!fs.existsSync(filepath)) {
    res.statusCode = 404;
    res.end('Not found');
    return;
  }

  switch (req.method) {
    case 'GET': {
      const fileStream = fs.createReadStream(filepath);
      fileStream
          .pipe(res)
          .on('error', () => {
            res.statusCode = 500;
            res.end('Internal server error');
          });
      break;
    }

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
