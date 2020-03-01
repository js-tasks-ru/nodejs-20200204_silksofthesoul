const Category = require('../models/Category.js');
const {removeProperty} = require('../libs/object');

module.exports.categoryList = async function categoryList(ctx, next) {
  const Model = Category;
  let categories = await Model.find({}, {
    '__v': 0,
    'subcategories.__v': 0,
  });
  categories = categories
      .map((cat) => ({
        id: cat.toObject()._id,
        ...removeProperty('_id')(cat.toObject()),
        subcategories: cat.toObject().subcategories.map((sub) => ({
          id: sub._id,
          ...removeProperty('_id')(sub),
        })),
      }));
  ctx.response.body = {categories};
  next();
};
