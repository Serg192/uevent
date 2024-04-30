const logger = require("../../config/logger");

function parsePagination(req) {
  let { page, pageSize } = req.query;
  if (!page || page <= 0) page = 1;
  if (!pageSize || pageSize <= 0) pageSize = 10;

  return {
    page,
    pageSize,
  };
}

async function paginate(model, paginationOpt, filter, projection, select) {
  const { page, pageSize, sort } = paginationOpt;
  const skip = (page - 1) * pageSize;
  const total = await model.countDocuments(filter);

  const data = await model
    .find(filter)
    .sort(sort)
    .skip(skip)
    .limit(pageSize)
    .populate(projection)
    .select(select)
    .exec();

  return { data, currentPage: page, pageSize, total };
}

module.exports = { paginate, parsePagination };
