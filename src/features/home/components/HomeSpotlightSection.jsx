import { renderStars } from '../utils/renderStars.jsx';

const HomeSpotlightSection = ({ spotlightDeal, onQuickView, onAddToCart }) => {
  if (!spotlightDeal) {
    return null;
  }

  const title = spotlightDeal.title ?? spotlightDeal.name;
  const reviews = spotlightDeal.reviews ?? spotlightDeal.reviewCount;
  const originalPrice = spotlightDeal.originalPrice ?? spotlightDeal.oldPrice;

  return (
    <section className="mt-16">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="relative h-full min-h-[320px] overflow-hidden bg-slate-100 dark:bg-slate-900">
            <img
              src={spotlightDeal.image}
              alt={title}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="p-8 md:p-12">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary-600">Today&apos;s Spotlight</p>
            <h3 className="text-3xl font-black leading-tight text-foreground">{title}</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted">{spotlightDeal.description}</p>

            <div className="mt-4 flex items-center gap-2">
              <div className="flex">{renderStars(spotlightDeal.rating)}</div>
              <span className="text-xs font-semibold text-muted">({reviews} reviews)</span>
            </div>

            <div className="mt-6 flex items-end gap-3">
              <span className="text-3xl font-black text-primary-700">${spotlightDeal.price}</span>
              <span className="text-sm text-muted line-through">${originalPrice}</span>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onAddToCart(spotlightDeal)}
                className="rounded-lg bg-primary-600 px-6 py-3 text-sm font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-primary-500"
              >
                Add to Cart
              </button>
              <button
                type="button"
                onClick={() => onQuickView(spotlightDeal)}
                className="rounded-lg border border-border bg-surface px-6 py-3 text-sm font-bold uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                Quick View
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeSpotlightSection;
