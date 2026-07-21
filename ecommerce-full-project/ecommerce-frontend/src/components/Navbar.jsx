import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${isActive ? 'text-plum-700' : 'text-stone-600 hover:text-plum-700'}`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur border-b border-stone-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link to="/home" className="font-display text-xl font-bold text-plum-700 shrink-0">
          Market Yard
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/home" className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink to="/products" className={navLinkClass}>
            Shop
          </NavLink>
          {user?.role === 'admin' && (
            <NavLink to="/admin" className={navLinkClass}>
              Admin
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/cart"
            className="relative text-sm font-medium text-stone-600 hover:text-plum-700"
            aria-label="View cart"
          >
            Cart
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-amber-400 text-ink text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <div className="hidden sm:flex items-center gap-3">
              <Link to="/orders" className="text-sm font-medium text-stone-600 hover:text-plum-700">
                My Orders
              </Link>
              <span className="text-sm text-stone-400">|</span>
              <span className="text-sm text-stone-600">Hi, {user.name?.split(' ')[0]}</span>
              <button onClick={handleLogout} className="btn-secondary !px-3 !py-1.5 text-xs">
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link to="/login" className="btn-secondary !px-3 !py-1.5 text-xs">
                Login
              </Link>
              <Link to="/register" className="btn-primary !px-3 !py-1.5 text-xs">
                Sign Up
              </Link>
            </div>
          )}

          <button
            className="md:hidden text-stone-600"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-stone-200 px-4 py-3 flex flex-col gap-3">
          <NavLink to="/home" className={navLinkClass} end onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/products" className={navLinkClass} onClick={() => setMenuOpen(false)}>
            Shop
          </NavLink>
          {user?.role === 'admin' && (
            <NavLink to="/admin" className={navLinkClass} onClick={() => setMenuOpen(false)}>
              Admin
            </NavLink>
          )}
          {user ? (
            <>
              <Link to="/orders" className="text-sm text-stone-600" onClick={() => setMenuOpen(false)}>
                My Orders
              </Link>
              <button onClick={handleLogout} className="btn-secondary w-fit !px-3 !py-1.5 text-xs">
                Logout
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="btn-secondary !px-3 !py-1.5 text-xs" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="btn-primary !px-3 !py-1.5 text-xs" onClick={() => setMenuOpen(false)}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
