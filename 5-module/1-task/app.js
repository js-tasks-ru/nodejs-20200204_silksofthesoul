const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

const clients = [];
router.get('/subscribe', async (ctx, next) => {
  const promise = new Promise((resolve, reject) => {
    clients.push(resolve);
    ctx.res.on('close', function() {
      clients.splice(clients.indexOf(resolve), 1);
      const error = new Error('Connection closed');
      error.code = 'ECONNRESET';
      reject(error);
    });
  });

  let message = null;
  try {
    message = await promise;
  } catch (err) {
    if (err.code === 'ECONNRESET') return;
    throw err;
  }
  ctx.body = message;
});

router.post('/publish', async (ctx, next) => {
  const message = ctx.request.body.message;
  if (!message) {
    ctx.status = 200;
    return next();
  }
  clients.forEach(function(resolve) {
    resolve(String(message));
  });
  // clients = [];
  ctx.body = 'ok';
});


app.use(router.routes());

module.exports = app;
