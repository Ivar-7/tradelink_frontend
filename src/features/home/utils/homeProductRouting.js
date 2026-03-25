import { buildRoute } from '../../../shared/utils/formatters';
import { ROUTES } from '../../../shared/constants/routes';

const HOME_TO_CATALOG_PRODUCT_ID = {
  'prod-1': 'prod-010',
  'prod-2': 'prod-012',
  'prod-3': 'prod-018',
  'prod-4': 'prod-002',
  'prod-5': 'prod-014',
  'prod-6': 'prod-011',
  'prod-7': 'prod-015',
  'prod-8': 'prod-001',
  'prod-9': 'prod-003',
};

export const resolveCatalogProductId = (homeProduct) => {
  if (!homeProduct) return null;

  if (typeof homeProduct === 'string') {
    return HOME_TO_CATALOG_PRODUCT_ID[homeProduct] ?? homeProduct;
  }

  if (homeProduct.catalogProductId) {
    return homeProduct.catalogProductId;
  }

  return HOME_TO_CATALOG_PRODUCT_ID[homeProduct.id] ?? homeProduct.id ?? null;
};

export const getHomeProductDetailPath = (homeProduct) => {
  const catalogProductId = resolveCatalogProductId(homeProduct);
  if (!catalogProductId) return ROUTES.PRODUCTS;
  return buildRoute(ROUTES.PRODUCT_DETAIL, { id: catalogProductId });
};
