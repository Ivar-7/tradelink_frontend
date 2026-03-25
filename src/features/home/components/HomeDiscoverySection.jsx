import HomeProductCard from './HomeProductCard';
import { renderStars } from '../utils/renderStars.jsx';

const HomeDiscoverySection = ({
  searchTerm,
  filteredProducts,
  emptyStateSuggestions,
  sortBy,
  minPrice,
  maxPrice,
  selectedBrands,
  selectedRatings,
  inStockOnly,
  brands,
  onSearchChange,
  onSortChange,
  onMinPriceChange,
  onMaxPriceChange,
  onToggleBrand,
  onToggleRating,
  onToggleInStock,
  onClearFilters,
  onOpenFilterModal,
  onQuickView,
  onAddToCart,
}) => {
  return (
    <section className="mt-20 rounded-2xl border border-border bg-surface p-6 shadow-sm md:p-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-muted">
            Product Discovery
          </p>
          <h2 className="text-3xl font-black tracking-tight">
            Results for '{searchTerm || 'all products'}'
          </h2>
          <p className="mt-2 text-sm text-muted">{filteredProducts.length} results found</p>
        </div>
        <button
          type="button"
          onClick={onOpenFilterModal}
          className="rounded-lg border border-border bg-slate-100 px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800"
        >
          Open Filter Panel
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <aside className="hidden lg:col-span-3 lg:block">
          <div className="sticky top-28 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted">Filters</h3>
              <button
                type="button"
                onClick={onClearFilters}
                className="text-xs font-bold uppercase text-primary-600"
              >
                Clear all
              </button>
            </div>

            <div>
              <p className="mb-3 text-sm font-bold">Price Range</p>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={minPrice}
                  onChange={(event) => onMinPriceChange(event.target.value || 0)}
                  className="rounded-lg border border-border bg-slate-50 px-3 py-2 text-sm dark:bg-slate-900"
                />
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(event) => onMaxPriceChange(event.target.value || 0)}
                  className="rounded-lg border border-border bg-slate-50 px-3 py-2 text-sm dark:bg-slate-900"
                />
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-bold">Brand</p>
              <div className="space-y-2">
                {brands.map((brand) => (
                  <label key={brand} className="flex cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => onToggleBrand(brand)}
                      className="h-4 w-4 rounded border-border text-primary-600"
                    />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-bold">Rating</p>
              <div className="space-y-2">
                {[5, 4, 3].map((rating) => (
                  <label key={rating} className="flex cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedRatings.includes(rating)}
                      onChange={() => onToggleRating(rating)}
                      className="h-4 w-4 rounded border-border text-primary-600"
                    />
                    <span className="flex items-center gap-1">{renderStars(rating)} and up</span>
                  </label>
                ))}
              </div>
            </div>

            <label className="flex items-center justify-between rounded-lg bg-slate-100 px-3 py-3 text-sm dark:bg-slate-900">
              <span className="font-semibold">In stock only</span>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={onToggleInStock}
                className="h-4 w-4 rounded border-border text-primary-600"
              />
            </label>
          </div>
        </aside>

        <div className="lg:col-span-9">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-slate-100 px-4 py-3 dark:bg-slate-900">
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search laptops, wearables, audio..."
              className="min-w-[240px] flex-1 rounded-lg border border-border bg-white px-3 py-2 text-sm dark:bg-slate-950"
            />
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted">Sort by</span>
              <select
                value={sortBy}
                onChange={(event) => onSortChange(event.target.value)}
                className="rounded-lg border border-border bg-white px-3 py-2 text-sm dark:bg-slate-950"
              >
                <option value="relevance">Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="rounded-2xl border border-border bg-slate-50 p-10 text-center dark:bg-slate-900/40">
              <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-slate-200 text-4xl dark:bg-slate-800">
                ⌕
              </div>
              <h3 className="text-2xl font-black tracking-tight">We couldn't find any matches.</h3>
              <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
                Try checking your spelling or searching for a different term.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {emptyStateSuggestions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => onSearchChange(item)}
                    className="rounded-full bg-primary-100 px-4 py-2 text-xs font-semibold text-primary-700 dark:bg-primary-900/40 dark:text-primary-300"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <HomeProductCard
                  key={product.id}
                  item={product}
                  onQuickView={onQuickView}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HomeDiscoverySection;
