import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct } from '../api/products';
import { useCart } from '../context/CartContext';
import { Spinner } from '../components/Feedback';

const PLACEHOLDER_IMAGE = '/images/product-placeholder.svg';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    setAdded(false);
    getProduct(id)
      .then((res) => {
        setProduct(res.data);
        setQty(1);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;
  if (!product) return <p className="text-center py-20 text-stone-400">Product not found.</p>;

  const outOfStock = product.stock === 0 || product.status === 'out_of_stock';

  const featureItems = [
    'Priority support with every order',
    'Easy returns within 14 days',
    'Fast shipping on orders above ₹500',
  ];

  const handleAdd = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] items-start">
        <div className="space-y-6">
          <div className="rounded-[32px] overflow-hidden bg-stone-100 shadow-xl">
            <img
            src={product.images?.[0] || PLACEHOLDER_IMAGE}
            alt={product.name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = PLACEHOLDER_IMAGE;
            }}
            className="w-full h-[560px] object-cover"
          />
          </div>

          {product.images?.length > 1 && (
            <div className="grid grid-cols-3 gap-4">
              {product.images.slice(1, 4).map((image, index) => (
                <div key={index} className="h-28 overflow-hidden rounded-3xl bg-stone-100">
                  <img
                    src={image || PLACEHOLDER_IMAGE}
                    alt={`${product.name} ${index + 2}`}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = PLACEHOLDER_IMAGE;
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <span className="tag-chip bg-plum-50 text-plum-700">{product.category?.name}</span>
            <h1 className="font-display text-3xl font-bold text-ink leading-tight">{product.name}</h1>
            <p className="text-stone-500 text-sm">Brand: {product.brand}</p>
            <p className="font-display text-3xl font-bold text-ink">₹{product.price.toLocaleString('en-IN')}</p>
            <p className="text-stone-600 leading-relaxed">{product.description}</p>
          </div>

          <div className="glass-card p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-stone-600">Availability</span>
                <span className={outOfStock ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}>
                  {outOfStock ? 'Out of stock' : `${product.stock} available`}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-stone-600">Delivery</span>
                <span className="text-sm text-stone-500">Free over ₹500</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-stone-600">Support</span>
                <span className="text-sm text-stone-500">7-day returns</span>
              </div>
              {!outOfStock && (
                <div className="flex items-center gap-4 pt-3">
                  <div className="flex items-center border border-stone-200 rounded-tag bg-white">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="px-3 py-2 text-stone-600 hover:text-plum-700"
                    >
                      −
                    </button>
                    <span className="px-3 text-sm font-medium">{qty}</span>
                    <button
                      onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                      className="px-3 py-2 text-stone-600 hover:text-plum-700"
                    >
                      +
                    </button>
                  </div>
                  <button onClick={handleAdd} className="btn-primary flex-1">
                    {added ? 'Added ✓' : 'Add to Cart'}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[32px] border border-stone-200 bg-stone-50 p-6 shadow-sm">
            <p className="text-sm font-semibold text-stone-600 mb-3">Why you’ll love it</p>
            <ul className="space-y-3 text-sm text-stone-600">
              {featureItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-plum-700" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {product.relatedProducts?.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-semibold mb-4">Related products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {product.relatedProducts.map((rp) => (
              <Link
                key={rp._id}
                to={`/products/${rp._id}`}
                className="card p-3 hover:border-plum-700 transition-colors"
              >
                <div className="aspect-square bg-stone-100 rounded-3xl mb-3 overflow-hidden">
                  <img
                    src={rp.images?.[0] || PLACEHOLDER_IMAGE}
                    alt={rp.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = PLACEHOLDER_IMAGE;
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm font-medium truncate">{rp.name}</p>
                <p className="text-sm text-stone-500">₹{rp.price.toLocaleString('en-IN')}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
