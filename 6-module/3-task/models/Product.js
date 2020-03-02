const mongoose = require('mongoose');
const connection = require('../libs/connection');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    index: true,
    required: true,
  },

  description: {
    type: String,
    index: true,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },

  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  images: [String],

});

productSchema.index(
    {title: 'text', description: 'text'},
    {
      name: 'TextSearchIndex',
      default_language: 'russian',
      weights: {
        title: 10,
        description: 5,
      },
    }
);

try {
  module.exports = connection.model('Product', productSchema);
} catch (e) {
  module.exports = connection.models.Product;
}
