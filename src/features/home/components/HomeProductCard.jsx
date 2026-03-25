import { Link } from 'react-router-dom';
import { formatCurrency } from '../../../shared/utils/formatters';
import { getHomeProductDetailPath, resolveCatalogProductId } from '../utils/homeProductRouting';

const renderStars = (rating, sizeClass = 'text-xs') => {
  const full = Math.floor(rating ?? 0);
  return Array.from({ length: 5 }).map((_, i) => (
    <span
      key={`${rating ?? 0}-${i}`}
      className={`${sizeClass} ${i < full ? 'text-amber-500' : 'text-slate-300 dark:text-slate-700'}`}
      aria-hidden="true"
    >
      ★
    </span>
  ));
};

const HomeProductCard = ({ item, onQuickView, onAddToCart, showProgress = false }) => {
  const detailPath = getHomeProductDetailPath(item);
  const catalogProductId = resolveCatalogProductId(item);
  const soldLabel = item.soldText ?? item.sold;

  return (
    <article className="group rounded-2xl border border-border bg-surface p-4 shadow-sm transition-shadow hover:shadow-lg">
      <Link to={detailPath} className="relative mb-4 block aspect-square overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-900">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {item.discountLabel ? (
          <span className="absolute left-2 top-2 rounded-full bg-red-600 px-2 py-1 text-[10px] font-black text-white">
            {item.discountLabel}
          </span>
        ) : null}
        {item.tag ? (
          <span className="absolute left-2 top-2 rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-black uppercase text-emerald-700">
            {item.tag}
          </span>
        ) : null}
      </Link>

      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-600">{item.brand}</p>
      <Link to={detailPath} className="mt-1 block text-sm font-semibold leading-snug text-foreground hover:text-primary-600">
        {item.name}
      </Link>

      {typeof item.rating === 'number' || soldLabel ? (
        <div className="mt-2 flex items-center gap-2 text-xs text-muted">
          {typeof item.rating === 'number' ? <span className="flex items-center gap-0.5">{renderStars(item.rating, 'text-xs')}</span> : null}
          {soldLabel ? <span>{soldLabel}</span> : null}
        </div>
      ) : null}

      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-lg font-black text-foreground">{formatCurrency(item.price)}</span>
        {item.originalPrice ? (
          <span className="text-xs text-muted line-through">{formatCurrency(item.originalPrice)}</span>
        ) : null}
      </div>

      {showProgress && typeof item.soldPct === 'number' ? (
        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between text-[10px] font-bold uppercase text-muted">
            <span>{item.soldPct}% sold</span>
            {item.soldPct > 80 ? <span className="text-red-600">Almost gone</span> : null}
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div className="h-full bg-red-600" style={{ width: `${item.soldPct}%` }} />
          </div>
        </div>
      ) : null}

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onQuickView(item)}
          className="rounded-lg border border-border bg-slate-100 px-3 py-2 text-xs font-bold uppercase tracking-[0.15em] text-foreground transition-colors hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800"
        >
          Quick
        </button>
        <button
          type="button"
          onClick={() => onAddToCart(catalogProductId)}
          className="rounded-lg bg-primary-600 px-3 py-2 text-xs font-bold uppercase tracking-[0.15em] text-white transition-colors hover:bg-primary-700"
          aria-label={`Add ${item.name} to cart`}
        >
          Add
        </button>
      </div>
    </article>
  );
};

export default HomeProductCard;
