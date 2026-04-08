import { useNavigate } from 'react-router-dom';
import { productCatalog } from '../data/productCatalog';
import useCartHook from '../../cart/hooks/useCartHook';
import { ROUTES } from '../../../shared/constants/routes';
import ProductCatalogCard from '../components/ProductCatalogCard';

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
          <ProductCatalogCard key={product.id} product={product} onAdd={handleAddToCart} />
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
