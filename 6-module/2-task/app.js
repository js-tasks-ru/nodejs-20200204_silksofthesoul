const Koa = require('koa');
const Router = require('koa-router');

const Product = require('./models/product.js');

const {categoryList} = require('./controllers/categories');
const {productsBySubcategory, productList, productById} = require('./controllers/products');

const app = new Koa();

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err.status) {
      ctx.status = err.status;
      ctx.body = {error: err.message};
    } else {
      console.error(err);
      ctx.status = 500;
      ctx.body = {error: 'Internal server error'};
    }
  }
});

const router = new Router({prefix: '/api'});

router.get('/categories', categoryList);
router.get('/products',
    (ctx, next) => productsBySubcategory(ctx, next, Product),
    (ctx, next) => productList(ctx, next, Product)
);
router.get('/products/:id', (ctx, next) => productById(ctx, next, Product));

app.use(router.routes());

module.exports = app;
