import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useVendorProductsHook } from '../hooks/useVendorHook';
import useCartHook from '../../cart/hooks/useCartHook';
import SkeletonLoader from '../../../shared/components/SkeletonLoader';
import { formatCurrency } from '../../../shared/utils/formatters';
import { ROUTES } from '../../../shared/constants/routes';
import { useCategoriesHook } from '../../products/hooks/useProductsHook';

const VendorProductsPage = () => {
  const { products, loading, error } = useVendorProductsHook();
  const { categories } = useCategoriesHook();
  const addItem = useCartHook((state) => state.addItem);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedCategories, setSelectedCategories] = useState([]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    const bySearch = query
      ? products.filter(
          (item) =>
            item.name.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query)
        )
      : products;

    const byCategory = selectedCategories.length
      ? bySearch.filter((item) => {
          if (!item.category_id) return false;
          return selectedCategories.includes(item.category_id);
        })
      : bySearch;

    if (sortBy === 'price-asc') {
      return [...byCategory].sort((a, b) => a.price - b.price);
    }

    if (sortBy === 'price-desc') {
      return [...byCategory].sort((a, b) => b.price - a.price);
    }

    if (sortBy === 'rating') {
      return [...byCategory].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    }

    return [...byCategory].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
  }, [products, search, selectedCategories, sortBy]);

  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((item) => item !== categoryId)
        : [...prev, categoryId]
    );
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="flex flex-col gap-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonLoader key={i} className="h-20 w-full" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-8 lg:px-6">
      <section className="relative overflow-hidden rounded-2xl border border-border bg-slate-950 px-6 py-16 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-800/30 via-transparent to-cyan-500/20" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-200">Sony Brand Store</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight lg:text-5xl">Creativity meets technology.</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-200/90">
            Explore curated Sony devices with premium support and direct storefront pricing.
          </p>
        </div>
      </section>

      <div className="mt-8 flex flex-col gap-6 lg:flex-row">
        <aside className="h-fit w-full shrink-0 rounded-2xl border border-border bg-surface p-5 lg:w-72">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Filters</h2>
            <button
              type="button"
              onClick={() => setSelectedCategories([])}
              className="text-xs font-semibold text-primary-600 hover:underline"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Categories</p>
            {categories.map((category) => (
              <label key={category.id} className="flex items-center gap-3 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => toggleCategory(category.id)}
                  className="h-4 w-4 rounded border-border text-primary-600"
                />
                <span>{category.name}</span>
              </label>
            ))}
          </div>

          <div className="mt-8 space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Quick Links</p>
            <Link to={ROUTES.VENDOR.DASHBOARD} className="block text-sm text-primary-600 hover:underline">Vendor Dashboard</Link>
            <Link to={ROUTES.PRODUCTS} className="block text-sm text-primary-600 hover:underline">Marketplace Products</Link>
            <Link to={ROUTES.REVIEWS} className="block text-sm text-primary-600 hover:underline">Product Reviews</Link>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">
              Showing <span className="font-bold text-foreground">{filteredProducts.length}</span> product(s)
            </p>

            <div className="flex items-center gap-3">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search Sony products..."
                className="rounded-lg border border-border bg-slate-50 px-3 py-2 text-sm text-foreground dark:bg-slate-900"
              />
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="rounded-lg border border-border bg-slate-50 px-3 py-2 text-sm text-foreground dark:bg-slate-900"
              >
                <option value="featured">Featured</option>
                <option value="rating">Top Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {error ? <p className="mb-4 text-sm text-destructive">{error}</p> : null}

          {filteredProducts.length === 0 ? (
            <div className="rounded-xl border border-border bg-surface p-8 text-center text-sm text-muted">
              No products found for the selected filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <article key={product.id} className="overflow-hidden rounded-xl border border-border bg-surface">
                  <div className="aspect-square overflow-hidden bg-slate-100 dark:bg-slate-900">
                    <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-600">Sony</span>
                      <span className="text-xs text-muted">{product.rating?.toFixed(1)} ★</span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground">{product.name}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted">{product.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-lg font-black text-foreground">{formatCurrency(product.price)}</p>
                      <button
                        type="button"
                        onClick={() => addItem({ product_id: product.id, quantity: 1 })}
                        className="rounded-lg bg-primary-600 px-3 py-2 text-xs font-bold uppercase tracking-[0.15em] text-white hover:bg-primary-700"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default VendorProductsPage;
