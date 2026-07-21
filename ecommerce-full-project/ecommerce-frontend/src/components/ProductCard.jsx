import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const PLACEHOLDER_IMAGE = '/images/product-placeholder.svg';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const outOfStock = product.stock === 0 || product.status === 'out_of_stock';
  const rating = Math.round((product.ratingsAverage || 0) * 10) / 10;
  const imageSrc = product.images?.[0] || PLACEHOLDER_IMAGE;

  return (
    <div className="card overflow-hidden flex flex-col group transition duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <Link to={`/products/${product._id}`} className="block aspect-square bg-stone-100 overflow-hidden">
        <img
          src={imageSrc}
          alt={product.name}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = PLACEHOLDER_IMAGE;
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </Link>
      <div className="p-4 flex flex-col gap-3 flex-1">
        <span className="tag-chip bg-plum-50 text-plum-700 w-fit">{product.category?.name || 'Uncategorized'}</span>
        <Link to={`/products/${product._id}`} className="font-display font-semibold text-ink leading-snug hover:text-plum-700">
          {product.name}
        </Link>
        <div className="text-sm text-stone-500">{product.brand}</div>
        {rating > 0 && (
          <div className="flex items-center gap-2 text-sm text-amber-600">
            <span>{'*'.repeat(Math.min(5, Math.round(rating)))}</span>
            <span className="text-stone-500">{rating} | {product.ratingsCount || 0}</span>
          </div>
        )}
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <span className="font-display text-lg font-bold text-ink">Rs. {product.price.toLocaleString('en-IN')}</span>
          {outOfStock ? (
            <span className="tag-chip bg-stone-100 text-stone-400">Out of stock</span>
          ) : (
            <button
              onClick={() => addToCart(product, 1)}
              className="btn-primary !px-3 !py-1.5 text-xs"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
