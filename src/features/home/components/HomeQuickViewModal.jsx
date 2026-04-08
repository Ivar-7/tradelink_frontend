import { Link } from 'react-router-dom';
import { renderStars } from '../utils/renderStars.jsx';
import { getHomeProductDetailPath } from '../utils/homeProductRouting';

const HomeQuickViewModal = ({ item, onClose, onAddToCart }) => {
  if (!item) {
    return null;
  }

  const detailPath = getHomeProductDetailPath(item);
  const title = item.title ?? item.name;
  const reviews = item.reviews ?? item.reviewCount;
  const originalPrice = item.originalPrice ?? item.oldPrice;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="h-72 overflow-hidden bg-slate-100 dark:bg-slate-900 lg:h-auto">
            <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
          </div>

          <div className="p-8">
            <div className="mb-3 flex items-center justify-between">
              <span className="rounded-full bg-primary-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary-700 dark:bg-primary-900/40 dark:text-primary-200">
                {item.badge ?? item.category ?? 'Featured Product'}
              </span>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-2 py-1 text-xl leading-none text-muted transition-colors hover:bg-slate-100 hover:text-foreground dark:hover:bg-slate-900"
                aria-label="Close quick view"
              >
                ×
              </button>
            </div>

            <h3 className="text-3xl font-black leading-tight text-foreground">{title}</h3>
            <p className="mt-3 text-sm text-muted">{item.description}</p>

            <div className="mt-4 flex items-center gap-2">
              <div className="flex">{renderStars(item.rating, 'text-base')}</div>
              <span className="text-xs font-medium text-muted">({reviews} reviews)</span>
            </div>

            <div className="mt-6 flex items-end gap-3">
              <span className="text-3xl font-black text-primary-700">${item.price}</span>
              <span className="text-sm text-muted line-through">${originalPrice}</span>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  onAddToCart(item);
                  onClose();
                }}
                className="rounded-lg bg-primary-600 px-6 py-3 text-sm font-bold uppercase tracking-[0.15em] text-white transition-colors hover:bg-primary-500"
              >
                Add to Cart
              </button>

              <Link
                to={detailPath}
                onClick={onClose}
                className="rounded-lg border border-border bg-surface px-6 py-3 text-sm font-bold uppercase tracking-[0.15em] text-foreground transition-colors hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                View Details
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-border pt-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Battery</p>
                <p className="mt-1 text-sm font-medium text-foreground">{item.battery ?? 'Up to 40 hours'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Waterproof</p>
                <p className="mt-1 text-sm font-medium text-foreground">{item.waterproof ?? 'IPX4 rated'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeQuickViewModal;
