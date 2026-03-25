import { useMemo, useState } from 'react';
import {
  topCategories,
  heroFeature,
  heroPerks,
  superDeals,
  productDiscoveryItems,
  spotlightProduct,
  quickViewProduct,
  moreToLove,
  searchDefaults,
  emptyStateSuggestions,
} from '../data/homePageData';

const renderStars = (rating, sizeClass = 'text-sm') => {
  const full = Math.floor(rating);
  return Array.from({ length: 5 }).map((_, i) => (
    <span
      key={`${rating}-${i}`}
      className={`${sizeClass} ${i < full ? 'text-amber-500' : 'text-slate-300 dark:text-slate-700'}`}
      aria-hidden="true"
    >
      ★
    </span>
  ));
};

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState(searchDefaults.term);
  const [minPrice, setMinPrice] = useState(searchDefaults.minPrice);
  const [maxPrice, setMaxPrice] = useState(searchDefaults.maxPrice);
  const [selectedBrands, setSelectedBrands] = useState(searchDefaults.selectedBrands);
  const [selectedRatings, setSelectedRatings] = useState(searchDefaults.selectedRatings);
  const [inStockOnly, setInStockOnly] = useState(searchDefaults.inStockOnly);
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  const filteredProducts = useMemo(() => {
    let items = productDiscoveryItems.filter((item) => {
      const term = searchTerm.trim().toLowerCase();
      const matchesTerm =
        term.length === 0 ||
        item.name.toLowerCase().includes(term) ||
        item.brand.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term);
      const matchesBrand =
        selectedBrands.length === 0 || selectedBrands.includes(item.brand);
      const matchesRating =
        selectedRatings.length === 0 || selectedRatings.some((r) => item.rating >= r);
      const matchesPrice = item.price >= Number(minPrice) && item.price <= Number(maxPrice);
      return matchesTerm && matchesBrand && matchesRating && matchesPrice;
    });

    if (inStockOnly) {
      items = items.slice(0, Math.max(1, items.length));
    }

    if (sortBy === 'price-asc') {
      items = [...items].sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-desc') {
      items = [...items].sort((a, b) => b.price - a.price);
    }
    if (sortBy === 'newest') {
      items = [...items].reverse();
    }

    return items;
  }, [searchTerm, selectedBrands, selectedRatings, minPrice, maxPrice, inStockOnly, sortBy]);

  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const toggleRating = (rating) => {
    setSelectedRatings((prev) =>
      prev.includes(rating) ? prev.filter((r) => r !== rating) : [...prev, rating]
    );
  };

  const clearFilters = () => {
    setMinPrice(searchDefaults.minPrice);
    setMaxPrice(searchDefaults.maxPrice);
    setSelectedBrands([]);
    setSelectedRatings([]);
    setInStockOnly(false);
  };

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 pb-16 pt-8 text-foreground lg:px-6">
      <section className="mt-2 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <aside className="rounded-2xl border border-border bg-surface p-4 shadow-sm lg:col-span-2">
          <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-muted">Categories</h3>
          <ul className="space-y-1">
            {topCategories.map((category) => (
              <li
                key={category.label}
                className="group flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                <span className="text-primary-600 transition-transform group-hover:scale-110">●</span>
                <span className="text-sm font-medium text-foreground">{category.label}</span>
              </li>
            ))}
          </ul>
        </aside>

        <div className="relative overflow-hidden rounded-2xl lg:col-span-8">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-700 to-primary-500" />
          <img
            src={heroFeature.image}
            alt="Hero spotlight"
            className="absolute inset-0 h-full w-full object-cover opacity-50 mix-blend-overlay"
          />
          <div className="relative z-10 flex min-h-[360px] flex-col justify-center px-8 py-12 md:px-16">
            <span className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-white/80">
              {heroFeature.badge}
            </span>
            <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-white md:text-6xl">
              {heroFeature.title}
            </h1>
            <p className="mb-8 mt-4 max-w-xl text-base text-white/90 md:text-lg">{heroFeature.subtitle}</p>
            <button
              type="button"
              className="w-fit rounded-xl bg-white px-8 py-3 text-sm font-bold text-primary-700 transition-colors hover:bg-slate-100"
            >
              {heroFeature.cta}
            </button>
          </div>
        </div>

        <aside className="flex flex-col gap-6 lg:col-span-2">
          <div className="rounded-2xl border border-border bg-surface p-5 text-center shadow-sm">
            <div className="mx-auto mb-4 h-16 w-16 overflow-hidden rounded-full border-2 border-primary-200 bg-slate-200" />
            <p className="mb-5 text-sm font-semibold italic text-foreground">{heroPerks.welcomeText}</p>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" className="rounded-lg bg-primary-600 py-2 text-xs font-bold text-white">
                Join
              </button>
              <button
                type="button"
                className="rounded-lg bg-slate-100 py-2 text-xs font-bold text-foreground dark:bg-slate-900"
              >
                Sign In
              </button>
            </div>
          </div>

          <div className="relative flex-1 overflow-hidden rounded-2xl bg-orange-100 p-5 dark:bg-orange-900/30">
            <h4 className="text-xl font-black leading-tight text-orange-900 dark:text-orange-200">
              {heroPerks.promoTitle}
            </h4>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-orange-700 dark:text-orange-300">
                {heroPerks.promoPrice}
              </span>
              <span className="text-xs font-semibold text-orange-800/70 dark:text-orange-300/80">
                {heroPerks.promoLabel}
              </span>
            </div>
            <button
              type="button"
              className="mt-6 w-full rounded-lg bg-orange-700 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90"
            >
              Claim Reward
            </button>
          </div>
        </aside>
      </section>

      <section className="mt-16">
        <div className="mb-8 flex flex-wrap items-end gap-6">
          <div className="flex items-center gap-2">
            <span className="text-3xl text-red-500">🔥</span>
            <h2 className="text-3xl font-black uppercase italic tracking-tight">Super Deals</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted">Ending in</span>
            <div className="flex gap-1 text-xs font-bold">
              <span className="rounded bg-red-600 px-2 py-1 text-white">12</span>
              <span className="text-red-600">:</span>
              <span className="rounded bg-red-600 px-2 py-1 text-white">45</span>
              <span className="text-red-600">:</span>
              <span className="rounded bg-red-600 px-2 py-1 text-white">09</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          {superDeals.map((deal) => (
            <article
              key={deal.id}
              className="rounded-2xl border border-border bg-surface p-4 transition-shadow hover:shadow-xl"
            >
              <div className="relative mb-4 aspect-square overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-900">
                <img src={deal.image} alt={deal.name} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
                <span className="absolute left-2 top-2 rounded-full bg-red-600 px-2 py-1 text-[10px] font-black text-white">
                  {deal.discountLabel}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-foreground">{deal.name}</h3>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-xl font-black text-red-600">${deal.price}</span>
                <span className="text-xs text-muted line-through">${deal.originalPrice}</span>
              </div>
              <div className="mt-3">
                <div className="mb-1 flex items-center justify-between text-[10px] font-bold uppercase text-muted">
                  <span>{deal.soldPct}% sold</span>
                  {deal.soldPct > 80 ? <span className="text-red-600">Almost gone</span> : null}
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <div className="h-full bg-red-600" style={{ width: `${deal.soldPct}%` }} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-20 rounded-2xl border border-border bg-surface p-6 shadow-sm md:p-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-muted">Product Discovery</p>
            <h2 className="text-3xl font-black tracking-tight">Results for '{searchTerm || 'all products'}'</h2>
            <p className="mt-2 text-sm text-muted">{filteredProducts.length} results found</p>
          </div>
          <button
            type="button"
            onClick={() => setShowFilterModal(true)}
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
                <button type="button" onClick={clearFilters} className="text-xs font-bold uppercase text-primary-600">
                  Clear all
                </button>
              </div>

              <div>
                <p className="mb-3 text-sm font-bold">Price Range</p>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value || 0)}
                    className="rounded-lg border border-border bg-slate-50 px-3 py-2 text-sm dark:bg-slate-900"
                  />
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value || 0)}
                    className="rounded-lg border border-border bg-slate-50 px-3 py-2 text-sm dark:bg-slate-900"
                  />
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm font-bold">Brand</p>
                <div className="space-y-2">
                  {searchDefaults.brands.map((brand) => (
                    <label key={brand} className="flex cursor-pointer items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
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
                        onChange={() => toggleRating(rating)}
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
                  onChange={() => setInStockOnly((v) => !v)}
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
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search laptops, wearables, audio..."
                className="min-w-[240px] flex-1 rounded-lg border border-border bg-white px-3 py-2 text-sm dark:bg-slate-950"
              />
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted">Sort by</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
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
                      onClick={() => setSearchTerm(item)}
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
                  <article key={product.id} className="group">
                    <div className="relative mb-3 aspect-[4/5] overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-900">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <button
                        type="button"
                        onClick={() => setShowQuickView(true)}
                        className="absolute inset-x-4 bottom-4 translate-y-10 rounded-xl bg-primary-600 py-2 text-xs font-bold uppercase tracking-[0.15em] text-white opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100"
                      >
                        Quick View
                      </button>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-600">{product.brand}</p>
                    <h3 className="mt-1 text-base font-bold leading-snug text-foreground">{product.name}</h3>
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted">
                      <span className="flex items-center gap-0.5">{renderStars(product.rating, 'text-xs')}</span>
                      <span>{product.soldText}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xl font-black text-foreground">${product.price}</span>
                      <button
                        type="button"
                        className="rounded-lg bg-primary-600 p-2 text-white transition-colors hover:bg-primary-700"
                        aria-label={`Add ${product.name} to cart`}
                      >
                        +
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mt-20 grid grid-cols-1 gap-10 rounded-2xl border border-border bg-surface p-6 shadow-sm lg:grid-cols-2 lg:p-10">
        <div className="overflow-hidden rounded-2xl bg-slate-100 p-8 dark:bg-slate-900">
          <img
            src={spotlightProduct.image}
            alt={spotlightProduct.name}
            className="h-full w-full object-contain"
          />
        </div>

        <div className="space-y-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-600">{spotlightProduct.brand}</p>
          <h2 className="text-4xl font-black leading-tight tracking-tight">{spotlightProduct.name}</h2>
          <div className="flex items-center gap-3 text-sm text-muted">
            <span className="flex items-center gap-0.5">{renderStars(spotlightProduct.rating)}</span>
            <span>({spotlightProduct.reviewCount} reviews)</span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-black text-foreground">${spotlightProduct.price}</span>
            <span className="text-xl text-muted line-through">${spotlightProduct.oldPrice}</span>
          </div>

          <p className="text-sm leading-relaxed text-muted">{spotlightProduct.description}</p>

          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-muted">Color Variant</p>
            <div className="flex gap-2">
              {spotlightProduct.variants.map((variant) => (
                <button
                  key={variant}
                  type="button"
                  className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-slate-100 dark:hover:bg-slate-900"
                >
                  {variant}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {spotlightProduct.bullets.map((item) => (
              <p key={item} className="text-sm text-foreground">
                • {item}
              </p>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="rounded-xl bg-gradient-to-br from-primary-700 to-primary-500 px-4 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              Add to Cart
            </button>
            <button
              type="button"
              onClick={() => setShowQuickView(true)}
              className="rounded-xl border border-border bg-slate-100 px-4 py-3 text-sm font-bold text-foreground transition-colors hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800"
            >
              Quick View
            </button>
          </div>
        </div>
      </section>

      <section className="mt-20">
        <h2 className="mb-8 flex items-center gap-3 text-2xl font-black uppercase tracking-tight">
          More to Love
          <span className="h-px flex-1 bg-border" />
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {moreToLove.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-square bg-slate-100 dark:bg-slate-900">
                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                <span className="absolute bottom-2 left-2 rounded bg-red-600 px-1.5 py-0.5 text-[9px] font-bold text-white">
                  Welcome Deal
                </span>
              </div>
              <div className="space-y-2 p-4">
                <h3 className="text-sm font-medium leading-tight text-foreground">{item.name}</h3>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="font-bold text-orange-600">⭐ {item.rating}</span>
                  <span className="text-muted">{item.sold}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-lg font-black text-foreground">${item.price}</span>
                  <span className="rounded border border-green-100 bg-green-50 px-1.5 py-0.5 text-[9px] font-bold uppercase text-green-700">
                    {item.tag}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {showFilterModal ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowFilterModal(false)}
            role="button"
            tabIndex={0}
            onKeyDown={() => setShowFilterModal(false)}
          />
          <section className="relative z-10 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-border bg-surface p-6 shadow-2xl md:p-8">
            <header className="mb-6 flex items-center justify-between">
              <h3 className="text-3xl font-black tracking-tight">Filter</h3>
              <button type="button" onClick={() => setShowFilterModal(false)} className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-900">
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
                    onChange={(e) => setMinPrice(e.target.value || 0)}
                    className="rounded-lg border border-border bg-slate-50 px-3 py-2 text-sm dark:bg-slate-900"
                  />
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value || 0)}
                    className="rounded-lg border border-border bg-slate-50 px-3 py-2 text-sm dark:bg-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">Brand</p>
                {searchDefaults.brands.map((brand) => (
                  <label key={brand} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
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
                      onChange={() => toggleRating(rating)}
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
                    onChange={() => setInStockOnly((v) => !v)}
                    className="h-4 w-4 rounded border-border text-primary-600"
                  />
                </label>
              </div>
            </div>

            <footer className="mt-8 flex items-center justify-between border-t border-border pt-5">
              <button type="button" onClick={clearFilters} className="text-xs font-bold uppercase tracking-[0.2em] text-muted hover:text-primary-600">
                Clear all
              </button>
              <button
                type="button"
                onClick={() => setShowFilterModal(false)}
                className="rounded-lg bg-primary-600 px-6 py-3 text-sm font-bold text-white"
              >
                Apply Filters
              </button>
            </footer>
          </section>
        </div>
      ) : null}

      {showQuickView ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/45 backdrop-blur-sm"
            onClick={() => setShowQuickView(false)}
            role="button"
            tabIndex={0}
            onKeyDown={() => setShowQuickView(false)}
          />
          <section className="relative z-10 grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl md:grid-cols-2">
            <div className="bg-slate-100 p-8 dark:bg-slate-900">
              <img src={quickViewProduct.image} alt={quickViewProduct.name} className="h-full w-full object-contain" />
            </div>
            <div className="p-8 md:p-10">
              <div className="mb-3 flex items-start justify-between">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-600">{quickViewProduct.badge}</p>
                <button type="button" onClick={() => setShowQuickView(false)} className="rounded-full p-1 text-muted hover:bg-slate-100 dark:hover:bg-slate-900">✕</button>
              </div>
              <h3 className="text-3xl font-black tracking-tight">{quickViewProduct.name}</h3>
              <div className="mt-3 flex items-center gap-2 text-sm text-muted">
                <span className="flex items-center gap-0.5">{renderStars(quickViewProduct.rating)}</span>
                <span>({quickViewProduct.reviewCount} reviews)</span>
              </div>
              <p className="mt-5 text-4xl font-extrabold text-foreground">${quickViewProduct.price}</p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button type="button" className="rounded-xl bg-gradient-to-br from-primary-700 to-primary-500 px-4 py-3 text-sm font-bold text-white">
                  Add to Cart
                </button>
                <button type="button" className="rounded-xl border border-border bg-slate-100 px-4 py-3 text-sm font-bold dark:bg-slate-900">
                  View Details
                </button>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4 border-t border-border pt-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Battery</p>
                  <p className="mt-1 text-sm font-medium text-foreground">{quickViewProduct.battery}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Waterproof</p>
                  <p className="mt-1 text-sm font-medium text-foreground">{quickViewProduct.waterproof}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
};

export default HomePage;
