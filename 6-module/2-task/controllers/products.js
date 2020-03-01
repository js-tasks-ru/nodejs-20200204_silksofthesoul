const url = require('url');
// const Product = require('../models/product.js');
const {removeProperty} = require('../libs/object');
// const {getCollection, getModel} = require('../libs/mockup');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next, Model) {
  const u = ctx.request.url;
  const params = url.parse(u);
  if (!params.query) return next();
  const query = params.query.split('=');
  if (query[0] === 'subcategory') {
    // const Model = Product;
    let products = await Model.find({'subcategory': query[1]}, {
      '__v': 0,
    });
    products = products.map((prd) => ({
      id: prd.toObject()._id,
      ...removeProperty('_id')(prd.toObject()),
    }));

    ctx.response.body = {products};
  }
};

module.exports.productList = async function productList(ctx, next, Model) {
  // const Model = Product;
  let products = await Model.find({}, {
    '__v': 0,
  });
  products = products.map((prd) => ({
    id: prd.toObject()._id,
    ...removeProperty('_id')(prd.toObject()),
  }));
  ctx.response.body = {products};
};

module.exports.productById = async function productById(ctx, next, Model) {
  const {params} = ctx;
  if (params.id) {
    // const Model = Product;
    let product = null;
    try {
      product = await Model.findOne({'_id': params.id}, {
        '__v': 0,
      });
    } catch (e) {
      ctx.response.status = 400;
      ctx.response.body = {error: 'invalid id'};
      return next();
    }
    if (!product) {
      ctx.response.status = 404;
      ctx.response.body = {error: 'Product not found!'};
      return next();
    }
    product = {
      id: product.toObject()._id,
      ...removeProperty('_id')(product.toObject()),
    };
    // console.log(product, '!!');
    ctx.response.body = {product};
  }
};
