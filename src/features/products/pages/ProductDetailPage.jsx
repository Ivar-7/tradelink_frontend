import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useCartHook from '../../cart/hooks/useCartHook';
import { buildRoute, formatCurrency } from '../../../shared/utils/formatters';
import { ROUTES } from '../../../shared/constants/routes';
import { useProductDetailHook, useProductsHook } from '../hooks/useProductsHook';
import PageLoader from '../../../shared/components/PageLoader';
import { useAuthHook } from '../../auth/hooks/useAuthHook';
import { useToast } from '../../../shared/hooks/useToastHook';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartHook((state) => state.addItem);
  const { user } = useAuthHook();
  const { addToast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const { product, loading, error } = useProductDetailHook(id);
  const { products: relatedPool, loading: relatedLoading } = useProductsHook({ limit: 8 });

  const relatedProducts = useMemo(
    () => relatedPool.filter((item) => item.id !== id).slice(0, 4),
    [id, relatedPool]
  );

  const handleAddToCart = async () => {
    if (!user) {
      addToast({ message: 'Please sign in to add products to cart.', type: 'warning' });
      navigate(ROUTES.AUTH.LOGIN);
      return;
    }

    const result = await addItem({ product_id: product.id, quantity });
    if (result?.ok) {
      addToast({ message: 'Product added to cart.', type: 'success' });
      return;
    }

    addToast({ message: result?.error || 'Could not add product to cart.', type: 'error' });
  };

  if (loading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-2xl font-black text-foreground">Could not load product</h1>
        <p className="mt-2 text-sm text-destructive">{error}</p>
        <Link to={ROUTES.PRODUCTS} className="mt-4 inline-flex text-sm font-semibold text-primary-600">
          Return to products
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-2xl font-black text-foreground">Product not found</h1>
        <Link to={ROUTES.PRODUCTS} className="mt-4 inline-flex text-sm font-semibold text-primary-600">
          Return to products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-8 lg:px-6">
      <section className="grid grid-cols-1 gap-8 rounded-2xl border border-border bg-surface p-6 lg:grid-cols-12 lg:p-8">
        <div className="overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-900 lg:col-span-6">
          <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
        </div>

        <div className="space-y-5 lg:col-span-6">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-primary-600">{product.vendor_name ?? 'Tradelink Seller'}</p>
          <h1 className="text-4xl font-black tracking-tight text-foreground">{product.name}</h1>
          <p className="text-sm leading-relaxed text-muted">{product.description}</p>
          <p className="text-3xl font-black text-foreground">{formatCurrency(product.price)}</p>

          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-muted">Quantity</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border"
              >
                -
              </button>
              <span className="w-8 text-center text-sm font-semibold text-foreground">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((value) => value + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border"
              >
                +
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className="rounded-xl bg-primary-600 px-4 py-3 text-sm font-bold uppercase tracking-[0.15em] text-white transition-colors hover:bg-primary-700"
            >
              Add to cart
            </button>
            <Link
              to={ROUTES.CART}
              className="inline-flex items-center justify-center rounded-xl border border-border bg-slate-100 px-4 py-3 text-sm font-bold uppercase tracking-[0.15em] text-foreground transition-colors hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800"
            >
              View cart
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-4 border-t border-border pt-4 text-xs font-semibold uppercase tracking-[0.14em]">
            <Link to={`${ROUTES.REVIEWS}?product=${product.id}`} className="text-primary-600 hover:underline">
              Read reviews
            </Link>
            <Link to={ROUTES.FEEDBACK} className="text-primary-600 hover:underline">
              Contact support
            </Link>
            <Link to={ROUTES.VENDOR.PRODUCTS} className="text-primary-600 hover:underline">
              Visit vendor store
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-5 text-2xl font-black tracking-tight text-foreground">Related Products</h2>
        {relatedLoading ? (
          <p className="text-sm text-muted">Loading related products...</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((item) => (
              <article key={item.id} className="overflow-hidden rounded-xl border border-border bg-surface">
                <div className="aspect-square overflow-hidden bg-slate-100 dark:bg-slate-900">
                  <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <div className="p-4">
                  <p className="line-clamp-1 text-sm font-semibold text-foreground">{item.name}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm font-bold text-primary-600">{formatCurrency(item.price)}</span>
                    <Link
                      to={buildRoute(ROUTES.PRODUCT_DETAIL, { id: item.id })}
                      className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground hover:text-primary-600"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductDetailPage;
