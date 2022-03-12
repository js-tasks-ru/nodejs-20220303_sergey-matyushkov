const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

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

  if (fs.existsSync(filepath)) {
    res.statusCode = 409;
    res.end('File exists');
    return;
  }

  switch (req.method) {
    case 'POST': {
      const limitStream = new LimitSizeStream({
        limit: 1048576,
      });
      const fileStream = fs.createWriteStream(filepath);

      req.pipe(limitStream).pipe(fileStream);

      req.on('aborted', () => {
        fs.unlinkSync(filepath);
        limitStream.destroy();
        fileStream.destroy();
      });

      limitStream.on('error', () => {
        res.statusCode = 413;
        res.end('File is more than 1Mb');
        fileStream.destroy();
        fs.unlinkSync(filepath);
      });

      fileStream.on('error', () => {
        fs.unlinkSync(filepath);
        res.statusCode = 500;
        res.end('Internal server error');
      });

      fileStream.on('finish', () => {
        res.statusCode = 201;
        res.end('File uploaded');
      });

      break;
    }

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
