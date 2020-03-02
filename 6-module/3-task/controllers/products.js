const url = require('url');

// const Category = require('../models/Category.js');
// const Product = require('../models/Product.js');
const {getModel} = require('../libs/mockup');

const {removeProperty} = require('../libs/object');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const u = ctx.request.url;
  const params = url.parse(u);
  if (!params.query) return next();
  const query = params.query.split('=');
  if (query[0] === 'query') {
    if (!query[1]) {
      ctx.response.body = {products: []};
      return next();
    }
    const key = 'Product';
    const Products = await getModel(key);
    let products = await Products.find({$text: {$search: query[1]}}, {
      '__v': 0,
    });
    products = products.map((prd) => ({
      id: prd.toObject()._id,
      ...removeProperty('_id')(prd.toObject()),
    }));
    ctx.response.body = {products};
  }
};
