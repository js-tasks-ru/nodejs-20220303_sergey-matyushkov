const mongoose = require('mongoose');
const Product = require('../models/Product');
const mapProduct = require('../mappers/product');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;

  if (!subcategory) {
    return next();
  }

  if (!mongoose.Types.ObjectId.isValid(subcategory)) {
    ctx.status = 400;
    ctx.body = 'Bad request';
    return;
  }

  const raw = await Product.find({subcategory: {_id: subcategory}});
  const products = raw.map(mapProduct);

  ctx.body = {products};
};

module.exports.productList = async function productList(ctx, next) {
  const raw = await Product.find();
  const products = raw.map(mapProduct);

  ctx.body = {products};
};

module.exports.productById = async function productById(ctx, next) {
  const {id} = ctx.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    ctx.status = 400;
    ctx.body = 'Bad request';
    return;
  }

  const raw = await Product.findOne({_id: id});

  if (!raw) {
    ctx.status = 404;
    ctx.body = 'Not found';
    return;
  }

  const product = mapProduct(raw);

  ctx.body = {product};
};
