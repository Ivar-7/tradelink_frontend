import { useMemo, useState } from 'react';
import {
  heroFeature,
  heroPerks,
  quickViewProduct,
} from '../data/homePageData';
import useCartHook from '../../cart/hooks/useCartHook';
import HomeTopSection from '../components/HomeTopSection';
import HomeDealsSection from '../components/HomeDealsSection';
import HomeSpotlightSection from '../components/HomeSpotlightSection';
import HomeMoreToLoveSection from '../components/HomeMoreToLoveSection';
import HomeQuickViewModal from '../components/HomeQuickViewModal';
import { resolveCatalogProductId } from '../utils/homeProductRouting';
import { useAuthHook } from '../../auth/hooks/useAuthHook';
import { useCategoriesHook, useProductsHook } from '../../products/hooks/useProductsHook';
import { useToast } from '../../../shared/hooks/useToastHook';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../shared/constants/routes';

const CATEGORY_ICON_MAP = {
  electronics: '💻',
  fashion: '👗',
  beauty: '💄',
  'smart home': '🏡',
  gaming: '🎧',
  'sports & fitness': '⚽',
};

const HomePage = () => {
  const { user } = useAuthHook();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [quickViewItem, setQuickViewItem] = useState(null);
  const addItem = useCartHook((state) => state.addItem);
  const { products, loading: productsLoading, error: productsError } = useProductsHook({ limit: 20 });
  const { categories, loading: categoriesLoading } = useCategoriesHook();

  const categoriesFromProducts = useMemo(() => {
    const unique = new Map();
    products.forEach((product) => {
      if (product.category?.id && product.category?.name) {
        unique.set(product.category.id, {
          id: product.category.id,
          name: product.category.name,
        });
      }
    });
    return Array.from(unique.values());
  }, [products]);

  const categorySource = categories.length ? categories : categoriesFromProducts;

  const topCategories = useMemo(
    () =>
      categorySource.slice(0, 7).map((category) => ({
        id: category.id,
        label: category.name,
        icon: CATEGORY_ICON_MAP[category.name.toLowerCase()] ?? '🛍️',
      })),
    [categorySource]
  );

  const mappedHomeProducts = useMemo(
    () =>
      products.map((product) => ({
        id: product.id,
        name: product.name,
        title: product.name,
        description: product.description,
        image: product.image_url,
        price: product.price,
        rating: product.average_rating ?? 0,
        reviewCount: product.review_count ?? 0,
        reviews: product.review_count ?? 0,
        brand: product.vendor_name ?? 'Tradelink Seller',
        sold: `${product.review_count ?? 0} reviews`,
        category: product.category?.name,
      })),
    [products]
  );

  const superDealsProducts = useMemo(
    () => mappedHomeProducts.slice(0, 5),
    [mappedHomeProducts]
  );

  const moreToLoveProducts = useMemo(
    () => mappedHomeProducts.slice(5, 10),
    [mappedHomeProducts]
  );

  const handleOpenQuickView = (product) => {
    const resolvedCatalogId = resolveCatalogProductId(product);

    setQuickViewItem({
      ...quickViewProduct,
      ...product,
      id: product.id ?? resolvedCatalogId,
      catalogProductId: resolvedCatalogId,
      name: product.name ?? product.title ?? quickViewProduct.name,
      title: product.title ?? product.name ?? quickViewProduct.name,
      reviews: product.reviews ?? product.reviewCount ?? quickViewProduct.reviewCount,
      reviewCount: product.reviewCount ?? product.reviews ?? quickViewProduct.reviewCount,
      originalPrice: product.originalPrice ?? product.oldPrice,
      oldPrice: product.oldPrice ?? product.originalPrice,
      category: product.category ?? quickViewProduct.badge,
      brand: product.brand ?? quickViewProduct.brand,
    });
  };

  const handleAddFromHome = async (itemOrId) => {
    if (!user) {
      addToast({ message: 'Please sign in to add products to cart.', type: 'warning' });
      navigate(ROUTES.AUTH.LOGIN);
      return;
    }

    const catalogProductId =
      typeof itemOrId === 'string' ? itemOrId : resolveCatalogProductId(itemOrId);

    if (!catalogProductId) {
      addToast({ message: 'Unable to identify this product.', type: 'error' });
      return;
    }

    const result = await addItem({ product_id: catalogProductId, quantity: 1 });
    if (result?.ok) {
      addToast({ message: 'Product added to cart.', type: 'success' });
      return;
    }

    addToast({ message: result?.error || 'Could not add product to cart.', type: 'error' });
  };

  const spotlightItem = useMemo(
    () => mappedHomeProducts[0] ?? null,
    [mappedHomeProducts]
  );

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 pb-16 pt-8 text-foreground lg:px-6">
      <HomeTopSection
        topCategories={topCategories}
        categoriesLoading={categoriesLoading && !categorySource.length}
        heroFeature={heroFeature}
        heroPerks={heroPerks}
        currentUser={user}
      />

      <HomeDealsSection
        superDeals={superDealsProducts}
        loading={productsLoading}
        error={productsError}
        onQuickView={handleOpenQuickView}
        onAddToCart={handleAddFromHome}
      />

      <HomeSpotlightSection
        spotlightDeal={spotlightItem}
        onQuickView={handleOpenQuickView}
        onAddToCart={handleAddFromHome}
      />

      <HomeMoreToLoveSection
        moreToLoveProducts={moreToLoveProducts}
        loading={productsLoading}
        error={productsError}
        onQuickView={handleOpenQuickView}
        onAddToCart={handleAddFromHome}
      />

      <HomeQuickViewModal
        item={quickViewItem}
        onClose={() => setQuickViewItem(null)}
        onAddToCart={handleAddFromHome}
      />
    </div>
  );
};

export default HomePage;
