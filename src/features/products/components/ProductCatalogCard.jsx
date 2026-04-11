import { Link } from 'react-router-dom';
import { formatCurrency, buildRoute } from '../../../shared/utils/formatters';
import { ROUTES } from '../../../shared/constants/routes';

const ProductCatalogCard = ({ product, onAdd }) => {
  const detailPath = buildRoute(ROUTES.PRODUCT_DETAIL, { id: product.id });

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition duration-300 hover:shadow-xl">
      <Link to={detailPath} className="block h-52 overflow-hidden bg-slate-100 dark:bg-slate-900">
        <img
          src={product.image_url}
          alt={product.name}
          className="h-full w-full object-cover transition duration-300 hover:scale-110"
        />
      </Link>

      <div className="p-4">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-600">{product.vendor_name ?? 'Tradelink Seller'}</p>
        <Link to={detailPath} className="mt-1 block text-lg font-semibold text-foreground hover:text-primary-600">
          {product.name}
        </Link>
        <p className="mt-1 text-sm text-muted">{product.description}</p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-black text-foreground">{formatCurrency(product.price)}</span>

          <button
            type="button"
            onClick={() => onAdd(product.id)}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary-700"
          >
            Add
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCatalogCard;
