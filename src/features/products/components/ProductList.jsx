import { ProductCardSkeleton } from '../../../shared/components/SkeletonLoader';
import EmptyState from '../../../shared/components/EmptyState';
import ProductCard from './ProductCard';
import { ROUTES } from '../../../shared/constants/routes';

/**
 * @param {{ products: import('../products.types').Product[], loading: boolean, error: string|null }} props
 */
const ProductList = ({ products, loading, error }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        title="Could not load products"
        message={error}
        actionLabel="Retry"
        actionTo={ROUTES.PRODUCTS}
      />
    );
  }

  if (!products.length) {
    return (
      <EmptyState
        title="No products found"
        message="Try adjusting your search or filters."
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
