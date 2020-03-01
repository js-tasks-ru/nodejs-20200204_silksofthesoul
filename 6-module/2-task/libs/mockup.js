const Category = require('../models/Category.js');
const Product = require('../models/product.js');
const {removeProperty} = require('./object');
const obj = {
  Category: {
    async create() {
      await Category.deleteMany({});
      await Category.create({
        title: 'Category1',
        subcategories: [{
          title: 'Subcategory1',
        }],
      });
      await Category.create({
        title: 'Category2',
        subcategories: [{
          title: 'Subcategory1',
        },
        {
          title: 'Subcategory2',
        }],
      });
    },
    async _get(_model=null) {
      const Model = _model||Category;
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
      return categories;
    },
  },
  Product: {
    async create() {
      const categories = await obj.Category._get();
      const category = categories[1];

      await Product.deleteMany({});
      await Product.create({
        title: 'Product1',
        description: 'Description1',
        price: 10,
        category: category.id,
        subcategory: category.subcategories[0].id,
        images: ['image1'],
      });

      await Product.create({
        title: 'Product2',
        description: 'Description2',
        price: 10,
        category: category.id,
        subcategory: category.subcategories[1].id,
        images: ['image1'],
      });
    },
    async _get(_model=null) {
      const Model = _model||Product;
      let products = await Model.find({}, {
        '__v': 0,
      });
      products = products.map((prd) => ({
        id: prd.toObject()._id,
        ...removeProperty('_id')(prd.toObject()),
      }));
      return products;
    },

  },
};
const models = {Category, Product};
const getModel = (key) => {
  const keys = Object.keys(models);
  if (!keys.includes(key)) return false;
  else return models[key];
};

const getCollection = async (key, model=null) => {
  const keys = Object.keys(obj);
  if (!keys.includes(key)) return false;
  else return await obj[key]._get(model);
};

const mockup = async (arrKeys) => {
  const keys = Object.keys(obj);
  for (const key of arrKeys) {
    if (!keys.includes(key)) continue;
    else await obj[key].create();
  }
};

module.exports.mockup = mockup;
module.exports.getModel = getModel;
module.exports.getCollection = getCollection;
