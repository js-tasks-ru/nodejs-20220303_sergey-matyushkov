const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let conections = [];

router.get('/subscribe', async (ctx, next) => {
  const promise = new Promise((resolve, _) => {
    conections.push(resolve);
  });

  const message = await promise;
  ctx.body = message;
});

router.post('/publish', async (ctx, next) => {
  const message = ctx.request.body.message;

  if (!message) {
    return;
  }

  conections.forEach((resolve) => resolve(message));
  conections = [];

  ctx.body = 'message published';
});

app.use(router.routes());

module.exports = app;
