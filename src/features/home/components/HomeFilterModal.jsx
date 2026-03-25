import { renderStars } from '../utils/renderStars';

const HomeFilterModal = ({
  isOpen,
  minPrice,
  maxPrice,
  selectedBrands,
  selectedRatings,
  inStockOnly,
  brands,
  onClose,
  onMinPriceChange,
  onMaxPriceChange,
  onToggleBrand,
  onToggleRating,
  onToggleInStock,
  onClearFilters,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        role="button"
        tabIndex={0}
        onKeyDown={onClose}
      />
      <section className="relative z-10 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-border bg-surface p-6 shadow-2xl md:p-8">
        <header className="mb-6 flex items-center justify-between">
          <h3 className="text-3xl font-black tracking-tight">Filter</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-900"
          >
            ✕
          </button>
        </header>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">Price Range</p>
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

          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">Brand</p>
            {brands.map((brand) => (
              <label key={brand} className="flex items-center gap-2 text-sm">
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

          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">Customer Rating</p>
            {[5, 4, 3].map((rating) => (
              <label key={rating} className="flex items-center gap-2 text-sm">
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

          <div className="rounded-lg bg-slate-100 p-4 dark:bg-slate-900">
            <p className="text-sm font-bold">Availability</p>
            <label className="mt-2 flex items-center justify-between text-sm">
              <span>In stock only</span>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={onToggleInStock}
                className="h-4 w-4 rounded border-border text-primary-600"
              />
            </label>
          </div>
        </div>

        <footer className="mt-8 flex items-center justify-between border-t border-border pt-5">
          <button
            type="button"
            onClick={onClearFilters}
            className="text-xs font-bold uppercase tracking-[0.2em] text-muted hover:text-primary-600"
          >
            Clear all
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-primary-600 px-6 py-3 text-sm font-bold text-white"
          >
            Apply Filters
          </button>
        </footer>
      </section>
    </div>
  );
};

export default HomeFilterModal;
