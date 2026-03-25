import { useNavigate } from 'react-router-dom';
import { productCatalog } from '../data/productCatalog';
import useCartHook from '../../cart/hooks/useCartHook';
import { formatCurrency } from '../../../shared/utils/formatters';
import { ROUTES } from '../../../shared/constants/routes';

const ProductsPage = () => {
  const addItem = useCartHook((state) => state.addItem);
  const navigate = useNavigate();

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

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {productCatalog.map((product) => (
          <article
            key={product.id}
            className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition duration-300 hover:shadow-xl"
          >
            <div className="h-52 overflow-hidden bg-slate-100 dark:bg-slate-900">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover transition duration-300 hover:scale-110"
              />
            </div>

            <div className="p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-600">
                {product.brand}
              </p>
              <h3 className="mt-1 text-lg font-semibold text-foreground">{product.name}</h3>
              <p className="mt-1 text-sm text-muted">{product.description}</p>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xl font-black text-foreground">{formatCurrency(product.price)}</span>

                <button
                  type="button"
                  onClick={() => handleAddToCart(product.id)}
                  className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary-700"
                >
                  Add
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
