import { useEffect, useState } from 'react';
import { useVendorDashboardHook, useVendorProductsHook } from '../hooks/useVendorHook';
import SkeletonLoader from '../../../shared/components/SkeletonLoader';
import { formatCurrency } from '../../../shared/utils/formatters';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../shared/constants/routes';
import { VendorProductInputSchema } from '../vendor.types';
import { mapZodError } from '../../../shared/utils/errorHandler';
import VendorProductCard from '../components/VendorProductCard';
import { useToast } from '../../../shared/hooks/useToastHook';
import { useCategoriesHook } from '../../products/hooks/useProductsHook';

const StatCard = ({ label, value }) => (
  <div className="rounded-xl border border-border bg-surface p-5">
    <p className="text-sm text-muted">{label}</p>
    <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
  </div>
);

const VendorDashboardPage = () => {
  const { categories } = useCategoriesHook();
  const { dashboard, loading, error, refetch: refetchDashboard } = useVendorDashboardHook();
  const {
    products,
    loading: productsLoading,
    error: productsError,
    create,
    remove,
  } = useVendorProductsHook();
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category_id: '',
    stock_quantity: '',
    image_url: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!formData.category_id && categories.length) {
      setFormData((prev) => ({ ...prev, category_id: categories[0].id }));
    }
  }, [categories, formData.category_id]);

  const onFieldChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => {
      if (!prev[name]) return prev;
      const updated = { ...prev };
      delete updated[name];
      return updated;
    });
  };

  const onCreateProduct = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setFormErrors({});

    const payload = {
      name: formData.name.trim(),
      price: Number(formData.price),
      description: formData.description.trim(),
      category_id: formData.category_id.trim(),
      stock_quantity: Number(formData.stock_quantity),
      image_url: formData.image_url.trim(),
    };

    const parsed = VendorProductInputSchema.safeParse(payload);
    if (!parsed.success) {
      setFormErrors(mapZodError(parsed.error));
      setSubmitting(false);
      return;
    }

    try {
      await create(parsed.data);
      setFormData((prev) => ({
        name: '',
        price: '',
        description: '',
        category_id: prev.category_id,
        stock_quantity: '',
        image_url: '',
      }));
      await refetchDashboard();
      addToast({ message: 'Product added to your storefront.', type: 'success' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not create product.';
      addToast({ message, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const onDeleteProduct = async (id) => {
    try {
      await remove(id);
      await refetchDashboard();
      addToast({ message: 'Product removed.', type: 'success' });
    } catch {
      addToast({ message: 'Could not remove product.', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonLoader key={i} className="h-24 w-full" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-8 lg:px-6">
      <header className="mb-8 rounded-2xl border border-border bg-surface p-6">
        <h1 className="text-4xl font-black tracking-tight text-foreground">Vendor Dashboard</h1>
        <p className="mt-2 text-sm text-muted">Monitor sales performance and manage your Sony storefront.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to={ROUTES.VENDOR.PRODUCTS} className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700">
            Open Storefront
          </Link>
          <Link to={ROUTES.ORDERS} className="rounded-lg border border-border bg-slate-100 px-4 py-2 text-sm font-semibold text-foreground hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800">
            View Marketplace Orders
          </Link>
        </div>
      </header>

      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

      {dashboard && (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <StatCard label="Total Revenue" value={formatCurrency(dashboard.total_revenue)} />
            <StatCard label="Total Orders" value={dashboard.total_orders} />
            <StatCard label="Pending Orders" value={dashboard.pending_orders} />
            <StatCard label="Active Products" value={dashboard.active_products} />
          </div>

          <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <div className="rounded-2xl border border-border bg-surface p-5">
              <h2 className="text-lg font-semibold text-foreground">Add New Product</h2>
              <p className="mt-1 text-sm text-muted">Products created here appear in your vendor storefront immediately.</p>

              <form className="mt-5 grid gap-4" onSubmit={onCreateProduct}>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.15em] text-muted" htmlFor="vendor-product-name">Product Name</label>
                  <input
                    id="vendor-product-name"
                    name="name"
                    value={formData.name}
                    onChange={onFieldChange}
                    className="w-full rounded-lg border border-border bg-slate-50 px-3 py-2 text-sm text-foreground dark:bg-slate-900"
                    placeholder="Sony WH-1000XM6"
                  />
                  {formErrors.name ? <p className="mt-1 text-xs text-destructive">{formErrors.name}</p> : null}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.15em] text-muted" htmlFor="vendor-product-price">Price</label>
                    <input
                      id="vendor-product-price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={onFieldChange}
                      className="w-full rounded-lg border border-border bg-slate-50 px-3 py-2 text-sm text-foreground dark:bg-slate-900"
                      placeholder="149.99"
                    />
                    {formErrors.price ? <p className="mt-1 text-xs text-destructive">{formErrors.price}</p> : null}
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.15em] text-muted" htmlFor="vendor-product-stock">Stock</label>
                    <input
                      id="vendor-product-stock"
                      name="stock_quantity"
                      type="number"
                      min="0"
                      step="1"
                      value={formData.stock_quantity}
                      onChange={onFieldChange}
                      className="w-full rounded-lg border border-border bg-slate-50 px-3 py-2 text-sm text-foreground dark:bg-slate-900"
                      placeholder="10"
                    />
                    {formErrors.stock_quantity ? <p className="mt-1 text-xs text-destructive">{formErrors.stock_quantity}</p> : null}
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.15em] text-muted" htmlFor="vendor-product-category">Category</label>
                  <select
                    id="vendor-product-category"
                    name="category_id"
                    value={formData.category_id}
                    onChange={onFieldChange}
                    className="w-full rounded-lg border border-border bg-slate-50 px-3 py-2 text-sm text-foreground dark:bg-slate-900"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                  {formErrors.category_id ? <p className="mt-1 text-xs text-destructive">{formErrors.category_id}</p> : null}
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.15em] text-muted" htmlFor="vendor-product-image">Image URL</label>
                  <input
                    id="vendor-product-image"
                    name="image_url"
                    value={formData.image_url}
                    onChange={onFieldChange}
                    className="w-full rounded-lg border border-border bg-slate-50 px-3 py-2 text-sm text-foreground dark:bg-slate-900"
                    placeholder="https://example.com/sony-product.jpg"
                  />
                  {formErrors.image_url ? <p className="mt-1 text-xs text-destructive">{formErrors.image_url}</p> : null}
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.15em] text-muted" htmlFor="vendor-product-description">Description</label>
                  <textarea
                    id="vendor-product-description"
                    name="description"
                    value={formData.description}
                    onChange={onFieldChange}
                    rows={4}
                    className="w-full rounded-lg border border-border bg-slate-50 px-3 py-2 text-sm text-foreground dark:bg-slate-900"
                    placeholder="Add a clear product summary for shoppers."
                  />
                  {formErrors.description ? <p className="mt-1 text-xs text-destructive">{formErrors.description}</p> : null}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? 'Adding Product...' : 'Add Product'}
                </button>
              </form>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-5">
              <h2 className="text-lg font-semibold text-foreground">Your Products</h2>
              {productsError ? <p className="mt-2 text-sm text-destructive">{productsError}</p> : null}

              <div className="mt-4 flex max-h-[560px] flex-col gap-3 overflow-y-auto pr-1">
                {productsLoading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <SkeletonLoader key={index} className="h-20 w-full" />
                  ))
                ) : null}

                {!productsLoading && products.length ? (
                  products.map((product) => (
                    <VendorProductCard
                      key={product.id}
                      product={product}
                      onDelete={() => onDeleteProduct(product.id)}
                    />
                  ))
                ) : null}

                {!productsLoading && !products.length ? (
                  <div className="rounded-lg border border-border px-4 py-6 text-center text-sm text-muted">
                    No products yet. Use the form to publish your first product.
                  </div>
                ) : null}
              </div>
            </div>
          </section>

          <div className="mt-8">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Recent Orders</h2>
            <div className="flex flex-col gap-2">
              {dashboard.recent_orders.map((order) => (
                <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface px-4 py-3">
                  <span className="text-sm font-semibold text-foreground">#{order.id}</span>
                  <span className="text-xs uppercase tracking-[0.14em] text-muted">{order.status}</span>
                  <span className="text-sm font-medium text-primary-600">{formatCurrency(order.order_amount)}</span>
                </div>
              ))}

              {!dashboard.recent_orders.length ? (
                <div className="rounded-lg border border-border bg-surface px-4 py-6 text-center text-sm text-muted">
                  No vendor-mapped orders yet. Keep your storefront active and promoted.
                </div>
              ) : null}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VendorDashboardPage;
