const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 0; //mongoDB return all when the limit num is 0

function getPagenation(query) {
  const page = Math.abs(query.page) || DEFAULT_PAGE;
  const limit = Math.abs(query.limit) || DEFAULT_LIMIT;
  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
  };
}

module.exports = { getPagenation };
