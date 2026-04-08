import { useMemo, useState } from 'react';
import {
  topCategories,
  heroFeature,
  heroPerks,
  superDeals,
  spotlightProduct,
  quickViewProduct,
  moreToLove,
} from '../data/homePageData';
import useCartHook from '../../cart/hooks/useCartHook';
import HomeTopSection from '../components/HomeTopSection';
import HomeDealsSection from '../components/HomeDealsSection';
import HomeSpotlightSection from '../components/HomeSpotlightSection';
import HomeMoreToLoveSection from '../components/HomeMoreToLoveSection';
import HomeQuickViewModal from '../components/HomeQuickViewModal';
import { resolveCatalogProductId } from '../utils/homeProductRouting';
import { useAuthHook } from '../../auth/hooks/useAuthHook';

const HomePage = () => {
  const { user } = useAuthHook();
  const [quickViewItem, setQuickViewItem] = useState(null);
  const addItem = useCartHook((state) => state.addItem);

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

  const handleAddFromHome = (itemOrId) => {
    const catalogProductId =
      typeof itemOrId === 'string' ? itemOrId : resolveCatalogProductId(itemOrId);

    if (!catalogProductId) {
      return;
    }

    addItem({ product_id: catalogProductId, quantity: 1 });
  };

  const spotlightItem = useMemo(
    () => ({ ...spotlightProduct, id: 'prod-014', catalogProductId: 'prod-014' }),
    []
  );

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 pb-16 pt-8 text-foreground lg:px-6">
      <HomeTopSection
        topCategories={topCategories}
        heroFeature={heroFeature}
        heroPerks={heroPerks}
        currentUser={user}
      />

      <HomeDealsSection
        superDeals={superDeals}
        onQuickView={handleOpenQuickView}
        onAddToCart={handleAddFromHome}
      />

      <HomeSpotlightSection
        spotlightDeal={spotlightItem}
        onQuickView={handleOpenQuickView}
        onAddToCart={handleAddFromHome}
      />

      <HomeMoreToLoveSection
        moreToLoveProducts={moreToLove}
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
