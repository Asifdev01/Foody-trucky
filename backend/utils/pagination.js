const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

/**
 * Reads page/limit query params and returns { page, limit, skip } ready
 * for Mongoose's .skip().limit().
 */
const getPagination = (query = {}) => {
  let page = parseInt(query.page, 10);
  let limit = parseInt(query.limit, 10);

  if (!Number.isFinite(page) || page < 1) page = 1;
  if (!Number.isFinite(limit) || limit < 1) limit = DEFAULT_LIMIT;
  if (limit > MAX_LIMIT) limit = MAX_LIMIT;

  return { page, limit, skip: (page - 1) * limit };
};

const buildPaginationMeta = (page, limit, total) => ({
  page,
  limit,
  total,
  totalPages: Math.max(1, Math.ceil(total / limit)),
});

module.exports = { getPagination, buildPaginationMeta };
