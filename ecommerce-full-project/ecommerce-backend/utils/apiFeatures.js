// Reusable helper that turns req.query into a Mongoose filter/sort/pagination
// Usage: const { filter, sort, skip, limit, page } = buildProductQuery(req.query);
const buildProductQuery = (query) => {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    availability, // 'in_stock' | 'out_of_stock'
    sort,
    page = 1,
    limit = 12,
  } = query;

  const filter = {};

  if (search) {
    filter.$text = { $search: search };
  }

  if (category) {
    filter.category = category;
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  if (availability === 'in_stock') {
    filter.stock = { $gt: 0 };
    filter.status = 'active';
  } else if (availability === 'out_of_stock') {
    filter.stock = 0;
    filter.status = { $ne: 'inactive' };
  } else {
    filter.status = { $ne: 'inactive' };
  }

  let sortOption = { createdAt: -1 }; // default: newest
  if (sort === 'price_asc') sortOption = { price: 1 };
  else if (sort === 'price_desc') sortOption = { price: -1 };
  else if (sort === 'name_asc') sortOption = { name: 1 };
  else if (sort === 'name_desc') sortOption = { name: -1 };
  else if (sort === 'newest') sortOption = { createdAt: -1 };

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  return { filter, sort: sortOption, skip, limit: limitNum, page: pageNum };
};

module.exports = { buildProductQuery };
