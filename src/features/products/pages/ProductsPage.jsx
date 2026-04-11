import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCartHook from '../../cart/hooks/useCartHook';
import { ROUTES } from '../../../shared/constants/routes';
import ProductCatalogCard from '../components/ProductCatalogCard';
import { useCategoriesHook, useProductsHook } from '../hooks/useProductsHook';
import SkeletonLoader from '../../../shared/components/SkeletonLoader';
import EmptyState from '../../../shared/components/EmptyState';

const ProductsPage = () => {
  const addItem = useCartHook((state) => state.addItem);
  const navigate = useNavigate();
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const filters = useMemo(
    () => (selectedCategoryId ? { category_id: selectedCategoryId } : {}),
    [selectedCategoryId]
  );
  const { products, loading, error, refetch } = useProductsHook(filters);
  const { categories, loading: categoriesLoading } = useCategoriesHook();

  const handleAddToCart = async (productId) => {
    await addItem({ product_id: productId, quantity: 1 });
  };

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-8 lg:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-primary-600">Products</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-foreground">Shop Tech Essentials</h1>
        </div>
        <button
          type="button"
          onClick={() => navigate(ROUTES.CART)}
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary-700"
        >
          View Cart
        </button>
      </div>

      <div className="mb-6 rounded-xl border border-border bg-surface p-4">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-muted">Category Filters</p>
          <button
            type="button"
            onClick={() => setSelectedCategoryId('')}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              selectedCategoryId === ''
                ? 'bg-primary-600 text-white'
                : 'bg-slate-100 text-foreground hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800'
            }`}
          >
            All
          </button>

          {!categoriesLoading
            ? categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategoryId(category.id)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                    selectedCategoryId === category.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-slate-100 text-foreground hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800'
                  }`}
                >
                  {category.name}
                </button>
              ))
            : <span className="text-sm text-muted">Loading categories...</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 8 }).map((_, index) => (
              <SkeletonLoader key={index} className="h-[360px] w-full" />
            ))
          : null}

        {!loading && !error
          ? products.map((product) => (
              <ProductCatalogCard key={product.id} product={product} onAdd={handleAddToCart} />
            ))
          : null}
      </div>

      {!loading && error ? (
        <EmptyState
          title="Could not load products"
          message={error}
          actionLabel="Retry"
          actionTo={ROUTES.PRODUCTS}
        />
      ) : null}

      {!loading && !error && products.length === 0 ? (
        <EmptyState
          title="No products found"
          message="No products are available yet."
        />
      ) : null}

      {!loading && error ? (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => refetch(filters)}
            className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground hover:bg-slate-100 dark:hover:bg-slate-900"
          >
            Retry Loading Products
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default ProductsPage;
