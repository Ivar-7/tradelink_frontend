import { Link } from 'react-router-dom';
import { buildRoute } from '../../../shared/utils/formatters';
import { formatCurrency } from '../../../shared/utils/formatters';
import { ROUTES } from '../../../shared/constants/routes';

/**
 * @param {{ product: import('../products.types').Product }} props
 */
const ProductCard = ({ product }) => {
  const detailPath = buildRoute(ROUTES.PRODUCT_DETAIL, { id: product.id });

  return (
    <Link
      to={detailPath}
      className="group flex flex-col rounded-xl border border-border bg-surface transition-shadow hover:shadow-md"
    >
      <div className="aspect-square overflow-hidden rounded-t-xl bg-border">
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-xs text-muted">{product.vendor_name ?? 'Tradelink Seller'}</p>
        <h3 className="line-clamp-2 text-sm font-semibold text-foreground">{product.name}</h3>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-base font-bold text-primary-600">
            {formatCurrency(product.price)}
          </span>
          {product.stock_quantity === 0 && (
            <span className="rounded bg-destructive px-2 py-0.5 text-xs font-medium text-white">
              Out of stock
            </span>
          )}
        </div>
        {product.average_rating != null && (
          <p className="text-xs text-muted">
            ★ {product.average_rating.toFixed(1)} ({product.review_count ?? 0})
          </p>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
