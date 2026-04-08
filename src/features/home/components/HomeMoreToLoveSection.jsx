import HomeProductCard from './HomeProductCard';

const HomeMoreToLoveSection = ({ moreToLoveProducts, onQuickView, onAddToCart }) => {
  return (
    <section className="mt-16 pb-16">
      <h2 className="mb-8 text-3xl font-black uppercase tracking-tight">More to Love</h2>
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
