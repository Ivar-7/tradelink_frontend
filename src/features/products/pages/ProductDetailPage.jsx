import { useParams } from 'react-router-dom';
import { useProductDetailHook } from '../hooks/useProductsHook';
import SkeletonLoader from '../../../shared/components/SkeletonLoader';
import EmptyState from '../../../shared/components/EmptyState';
import { formatCurrency } from '../../../shared/utils/formatters';
import { ROUTES } from '../../../shared/constants/routes';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { product, loading, error } = useProductDetailHook(id);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <SkeletonLoader className="aspect-square w-full" />
          <div className="flex flex-col gap-4">
            <SkeletonLoader className="h-8 w-3/4" />
            <SkeletonLoader className="h-6 w-1/4" />
            <SkeletonLoader className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return <EmptyState title="Product not found" message={error ?? ''} actionLabel="Back to shop" actionTo={ROUTES.PRODUCTS} />;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-contain"
          />
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted">{product.category?.name}</p>
          <h1 className="text-2xl font-bold text-foreground">{product.name}</h1>
          <p className="text-3xl font-bold text-primary-600">{formatCurrency(product.price)}</p>
          <p className="text-sm leading-relaxed text-muted">{product.description}</p>

          <div className="mt-2 flex items-center gap-3">
            <span className={`text-sm font-medium ${product.stock_quantity > 0 ? 'text-success' : 'text-destructive'}`}>
              {product.stock_quantity > 0 ? `In stock (${product.stock_quantity})` : 'Out of stock'}
            </span>
          </div>

          <button
            disabled={product.stock_quantity === 0}
            className="mt-4 rounded-xl bg-primary-600 py-3 text-base font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
