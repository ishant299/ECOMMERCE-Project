import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="max-w-lg mx-auto px-4 py-32 text-center">
    <p className="font-display text-6xl font-bold text-plum-700 mb-4">404</p>
    <h1 className="font-display text-xl font-semibold mb-2">Page not found</h1>
    <p className="text-stone-500 mb-6">The page you're looking for doesn't exist or has moved.</p>
    <Link to="/" className="btn-primary">
      Back to home
    </Link>
  </div>
);

export default NotFound;
