import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../api/products';
import { getCategories } from '../api/categories';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import { Spinner } from '../components/Feedback';

const PRODUCT_PLACEHOLDER_IMAGE = '/images/product-placeholder.svg';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A to Z' },
  { value: 'name_desc', label: 'Name: Z to A' },
];

const DISCOVERY_SUGGESTIONS = [
  { label: 'Trending tech', search: 'smart', accent: 'bg-amber-100 text-amber-800' },
  { label: 'Work from home', search: 'lamp', accent: 'bg-sky-100 text-sky-800' },
  { label: 'Self care', search: 'serum', accent: 'bg-rose-100 text-rose-800' },
  { label: 'Weekend fitness', search: 'yoga', accent: 'bg-emerald-100 text-emerald-800' },
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

  const params = {
    search: searchParams.get('search') || undefined,
    category: searchParams.get('category') || undefined,
    minPrice: searchParams.get('minPrice') || undefined,
    maxPrice: searchParams.get('maxPrice') || undefined,
    availability: searchParams.get('availability') || undefined,
    sort: searchParams.get('sort') || 'newest',
    page: searchParams.get('page') || 1,
    limit: 12,
  };

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data));
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getProducts(params);
      setProducts(res.data);
      setMeta({ page: res.page, totalPages: res.totalPages, total: res.total });
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const updateParam = (key, value, options = {}) => {
    const { resetPage = true } = options;
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    if (resetPage) next.set('page', '1');
    setSearchParams(next);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam('search', searchInput);
  };

  const clearFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  const suggestedProducts = products.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <section className="glass-card mb-8 p-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr] items-end">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-amber-600">Curated storefront</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-ink mt-3">
            Discover premium gear for modern living
          </h1>
          <p className="mt-4 max-w-2xl text-sm sm:text-base text-stone-500 leading-relaxed">
            Browse a refined selection of products with professional design, advanced search, and curated categories designed for a futuristic shopping experience.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {DISCOVERY_SUGGESTIONS.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  setSearchInput(item.search);
                  updateParam('search', item.search);
                }}
                className={`rounded-full px-4 py-2 text-sm font-medium transition hover:scale-[1.01] ${item.accent}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[28px] border border-white/30 bg-white/85 p-5 shadow-[0_22px_50px_-32px_rgba(15,23,42,0.35)]">
            <p className="text-sm text-stone-500 uppercase tracking-[0.24em] mb-2">Featured products</p>
            <p className="text-3xl font-display font-semibold text-ink">{meta.total}</p>
          </div>
          <div className="rounded-[28px] border border-white/30 bg-white/85 p-5 shadow-[0_22px_50px_-32px_rgba(15,23,42,0.35)]">
            <p className="text-sm text-stone-500 uppercase tracking-[0.24em] mb-2">Fast filters</p>
            <p className="text-3xl font-display font-semibold text-ink">Smart search</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        <aside className="glass-card p-6 space-y-6">
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <label className="text-sm font-semibold text-stone-600 uppercase tracking-[0.18em]">Search</label>
            <input
              className="input"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </form>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-stone-600 uppercase tracking-[0.18em]">Category</p>
              <button
                type="button"
                onClick={() => updateParam('category', '')}
                className="text-xs uppercase tracking-[0.2em] text-plum-700"
              >
                All
              </button>
            </div>
            <div className="grid gap-2">
              {categories.map((c) => (
                <button
                  key={c._id}
                  type="button"
                  onClick={() => updateParam('category', c._id)}
                  className={`rounded-3xl px-4 py-2 text-left text-sm transition ${
                    searchParams.get('category') === c._id
                      ? 'bg-plum-700 text-paper shadow-sm'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-stone-600 uppercase tracking-[0.18em]">Price range</p>
            <div className="grid gap-3">
              <input
                type="number"
                placeholder="Min"
                className="input !py-2"
                defaultValue={searchParams.get('minPrice') || ''}
                onBlur={(e) => updateParam('minPrice', e.target.value)}
              />
              <input
                type="number"
                placeholder="Max"
                className="input !py-2"
                defaultValue={searchParams.get('maxPrice') || ''}
                onBlur={(e) => updateParam('maxPrice', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-stone-600 uppercase tracking-[0.18em]">Availability</label>
            <select
              className="input"
              value={searchParams.get('availability') || ''}
              onChange={(e) => updateParam('availability', e.target.value)}
            >
              <option value="">All</option>
              <option value="in_stock">In stock</option>
              <option value="out_of_stock">Out of stock</option>
            </select>
          </div>

          <button onClick={clearFilters} className="btn-secondary !py-3 text-sm w-full">
            Clear all filters
          </button>
        </aside>

        <main className="space-y-6">
          <div className="glass-card p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-stone-500">{meta.total} product{meta.total !== 1 ? 's' : ''} found</p>
              <h2 className="font-display text-2xl font-semibold text-ink mt-2">Shop the latest collection</h2>
              <p className="text-sm text-stone-500 mt-2">Explore new arrivals and quick suggestions tailored to what shoppers are browsing most.</p>
            </div>
            <select
              className="input !w-auto !py-3"
              value={searchParams.get('sort') || 'newest'}
              onChange={(e) => updateParam('sort', e.target.value)}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  Sort: {o.label}
                </option>
              ))}
            </select>
          </div>

          {suggestedProducts.length > 0 && (
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {suggestedProducts.map((product) => (
                <button
                  key={product._id}
                  type="button"
                  onClick={() => updateParam('search', product.name)}
                  className="overflow-hidden rounded-[28px] border border-white/40 bg-white/80 text-left shadow-[0_24px_60px_-38px_rgba(15,23,42,0.45)] transition hover:-translate-y-0.5"
                >
                  <div className="aspect-[4/3] bg-stone-100">
                    <img
                      src={product.images?.[0] || PRODUCT_PLACEHOLDER_IMAGE}
                      alt={product.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = PRODUCT_PLACEHOLDER_IMAGE;
                      }}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-amber-700 mb-2">Suggested pick</p>
                    <h3 className="font-display text-lg font-semibold text-ink">{product.name}</h3>
                    <p className="text-sm text-stone-500 mt-2">
                      Search this product instantly or use it as inspiration for similar results.
                    </p>
                  </div>
                </button>
              ))}
            </section>
          )}

          {loading ? (
            <Spinner />
          ) : products.length === 0 ? (
            <div className="glass-card p-10 text-center">
              <p className="text-sm uppercase tracking-[0.24em] text-amber-600 mb-3">No results</p>
              <h3 className="font-display text-2xl font-semibold text-ink mb-2">Try another search or filter</h3>
              <p className="text-stone-500">Adjust your search criteria to explore more products in the catalog.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
              <Pagination
                page={meta.page}
                totalPages={meta.totalPages}
                onChange={(p) => updateParam('page', p, { resetPage: false })}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;
