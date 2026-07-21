const Footer = () => (
  <footer className="border-t border-stone-200 mt-20 bg-paper">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-start">
      <div>
        <p className="font-display text-xl font-bold text-plum-700">Market Yard</p>
        <p className="mt-3 max-w-xl text-sm text-stone-500 leading-relaxed">
          A polished full-stack shopping experience with curated products, flexible checkout, and a clean modern storefront.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-6 text-sm text-stone-600">
        <div>
          <p className="font-semibold text-ink mb-3">Explore</p>
          <ul className="space-y-2">
            <li>Shop</li>
            <li>Categories</li>
            <li>Orders</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-ink mb-3">Support</p>
          <ul className="space-y-2">
            <li>Contact us</li>
            <li>Help center</li>
            <li>Privacy policy</li>
          </ul>
        </div>
      </div>
      <div className="lg:col-span-2 border-t border-stone-200 pt-6 text-sm text-stone-500 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <span>© 2026 Market Yard. All rights reserved.</span>
        <span>Designed for the Coding Age full-stack website project.</span>
      </div>
    </div>
  </footer>
);

export default Footer;
