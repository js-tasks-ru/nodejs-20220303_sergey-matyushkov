const Category = require('../models/Category');
const mapCategory = require('../mappers/category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const raw = await Category.find({});
  const categories = raw.map(mapCategory);

  ctx.body = {categories};
};
