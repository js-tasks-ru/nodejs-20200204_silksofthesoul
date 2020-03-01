const mongoose = require('mongoose');
const connection = require('../libs/connection');

const Schema = mongoose.Schema;

const subCategorySchema = new Schema({
  title: {
    type: String,
    required: true,
  },
});

const categorySchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  subcategories: [subCategorySchema],
}, {
  toObject: {virtuals: true},
  toJSON: {virtuals: true},
});
module.exports = connection.model('Category', categorySchema);
