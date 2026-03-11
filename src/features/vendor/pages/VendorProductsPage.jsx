import { Link } from 'react-router-dom';
import { useVendorProductsHook } from '../hooks/useVendorHook';
import VendorProductCard from '../components/VendorProductCard';
import EmptyState from '../../../shared/components/EmptyState';
import SkeletonLoader from '../../../shared/components/SkeletonLoader';

const VendorProductsPage = () => {
  const { products, loading, error, remove } = useVendorProductsHook();

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="flex flex-col gap-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonLoader key={i} className="h-20 w-full" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">My Products</h1>
        <Link
          to="#"
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          + Add Product
        </Link>
      </div>

      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

      {!products.length ? (
        <EmptyState title="No products yet" message="Add your first product to start selling." />
      ) : (
        <div className="flex flex-col gap-4">
          {products.map((product) => (
            <VendorProductCard
              key={product.id}
              product={product}
              onEdit={() => {}}
              onDelete={() => remove(product.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorProductsPage;
