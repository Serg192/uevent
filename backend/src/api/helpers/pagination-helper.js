const logger = require("../../config/logger");

async function paginate(model, paginationOpt, filter, projection) {
  const { page, pageSize, sort } = paginationOpt;
  const skip = (page - 1) * pageSize;
  const total = await model.countDocuments(filter);

  const data = await model
    .find(filter)
    .sort(sort)
    .skip(skip)
    .limit(pageSize)
    .populate(projection)
    .exec();

  return { data, currentPage: page, pageSize, total };
}

module.exports = { paginate };
