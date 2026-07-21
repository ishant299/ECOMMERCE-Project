import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../api/products';
import { getCategories } from '../api/categories';
import ProductCard from '../components/ProductCard';
import { Spinner } from '../components/Feedback';

const CATEGORY_PLACEHOLDER_IMAGE = '/images/category-placeholder.svg';
const PRODUCT_PLACEHOLDER_IMAGE = '/images/product-placeholder.svg';

const FEATURES = [
  {
    title: 'Fast local delivery',
    description: 'Orders over Rs. 500 ship free and arrive quickly with trusted local partners.',
  },
  {
    title: 'Curated collection',
    description: 'Handpicked products across electronics, fashion, home, and wellness.',
  },
  {
    title: 'Secure checkout',
    description: 'Built-in protection and easy payment options for a confident shopping experience.',
  },
];

const SEARCH_SPOTLIGHTS = ['smartwatch', 'linen shirt', 'air fryer', 'serum'];

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          getProducts({ sort: 'newest', limit: 24 }),
          getCategories(),
        ]);
        setFeatured(productsRes.data);
        setCategories(categoriesRes.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-20">
        <div className="hero-panel relative overflow-hidden p-10 lg:p-14">
          <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />
          <div className="grid gap-10 lg:grid-cols-[1.3fr_0.9fr] items-center">
            <div className="relative z-10">
              <span className="tag-chip bg-amber-400/20 text-amber-600 mb-4 inline-flex">
                Powered for the next generation
              </span>
              <h1 className="font-display text-4xl sm:text-5xl font-bold leading-tight text-paper">
                A sleek shopping experience built for modern buyers.
              </h1>
              <p className="mt-6 max-w-2xl text-stone-200 text-lg leading-relaxed">
                Market Yard modernizes e-commerce with crisp product stories, premium visuals, and a checkout flow that feels polished from first click to delivery.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/products" className="btn-primary">
                  Explore store
                </Link>
                <Link to="/products" className="btn-secondary">
                  View collections
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                {SEARCH_SPOTLIGHTS.map((term) => (
                  <Link
                    key={term}
                    to={`/products?search=${encodeURIComponent(term)}`}
                    className="tag-chip bg-white/10 text-white hover:bg-white/20"
                  >
                    Search {term}
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              {FEATURES.map((feature) => (
                <div key={feature.title} className="glass-card p-6 text-paper border-white/10 backdrop-blur-xl">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-200 mb-3">
                    {feature.title}
                  </p>
                  <p className="text-sm text-stone-100">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <p className="text-sm font-medium text-amber-600 uppercase tracking-[0.18em]">Top categories</p>
              <h2 className="text-2xl font-semibold text-ink">Shop by category</h2>
            </div>
            <Link to="/products" className="text-sm font-medium text-plum-700 hover:underline">
              See all products {'->'}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {categories.map((category) => (
              <Link
                key={category._id}
                to={`/products?category=${category._id}`}
                className="group relative overflow-hidden rounded-[28px] h-56 block bg-stone-900 shadow-xl"
              >
                <img
                  src={category.image || CATEGORY_PLACEHOLDER_IMAGE}
                  alt={category.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = CATEGORY_PLACEHOLDER_IMAGE;
                  }}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <span className="text-sm text-amber-200 font-semibold uppercase tracking-[0.16em] mb-2">
                    {category.name}
                  </span>
                  <p className="text-white text-base leading-snug">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <p className="text-sm text-stone-500">Handpicked for a premium experience</p>
            <h2 className="text-2xl font-semibold text-ink">Latest products</h2>
            <p className="text-sm text-stone-500 mt-2">Fresh arrivals from across the catalog, ready to search, browse, and add to cart.</p>
          </div>
          <Link to="/products" className="text-sm font-medium text-plum-700 hover:underline">
            View all {'->'}
          </Link>
        </div>

        {loading ? (
          <Spinner />
        ) : featured.length === 0 ? (
          <p className="text-stone-400">No products yet - check back soon.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
            {featured.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
