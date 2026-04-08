import HomeProductCard from './HomeProductCard';

const HomeDealsSection = ({ superDeals, onQuickView, onAddToCart }) => {
  return (
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
          <HomeProductCard
            key={deal.id}
            item={deal}
            onQuickView={onQuickView}
            onAddToCart={onAddToCart}
            showProgress
          />
        ))}
      </div>
    </section>
  );
};

export default HomeDealsSection;
