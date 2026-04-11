import HomeProductCard from './HomeProductCard';

const HomeDealsSection = ({ superDeals, loading, error, onQuickView, onAddToCart }) => {
  return (
    <section className="mt-16">
      <div className="mb-8 flex flex-wrap items-end gap-6">
        <div className="flex items-center gap-2">
          <span className="text-3xl text-red-500">🔥</span>
          <h2 className="text-3xl font-black uppercase italic tracking-tight">Super Deals</h2>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-muted">Loading live deals...</p>
      ) : null}

      {!loading && error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : null}

      {!loading && !error && !superDeals.length ? (
        <p className="text-sm text-muted">No live deals available yet.</p>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        {superDeals.map((deal) => (
          <HomeProductCard
            key={deal.id}
            item={deal}
            onQuickView={onQuickView}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </section>
  );
};

export default HomeDealsSection;
