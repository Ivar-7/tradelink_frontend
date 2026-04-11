import HomeProductCard from './HomeProductCard';

const HomeMoreToLoveSection = ({ moreToLoveProducts, loading, error, onQuickView, onAddToCart }) => {
  return (
    <section className="mt-16 pb-16">
      <h2 className="mb-8 text-3xl font-black uppercase tracking-tight">More to Love</h2>

      {loading ? <p className="mb-4 text-sm text-muted">Loading products...</p> : null}
      {!loading && error ? <p className="mb-4 text-sm text-destructive">{error}</p> : null}
      {!loading && !error && !moreToLoveProducts.length ? (
        <p className="mb-4 text-sm text-muted">No products available right now.</p>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        {moreToLoveProducts.map((product) => (
          <HomeProductCard
            key={product.id}
            item={product}
            onQuickView={onQuickView}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </section>
  );
};

export default HomeMoreToLoveSection;
