import { useMemo, useState } from 'react';
import {
  topCategories,
  heroFeature,
  heroPerks,
  superDeals,
  productDiscoveryItems,
  spotlightProduct,
  quickViewProduct,
  moreToLove,
  searchDefaults,
  emptyStateSuggestions,
} from '../data/homePageData';
import useCartHook from '../../cart/hooks/useCartHook';
import HomeTopSection from '../components/HomeTopSection';
import HomeDealsSection from '../components/HomeDealsSection';
import HomeDiscoverySection from '../components/HomeDiscoverySection';
import HomeSpotlightSection from '../components/HomeSpotlightSection';
import HomeMoreToLoveSection from '../components/HomeMoreToLoveSection';
import HomeFilterModal from '../components/HomeFilterModal';
import HomeQuickViewModal from '../components/HomeQuickViewModal';
import { resolveCatalogProductId } from '../utils/homeProductRouting';

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState(searchDefaults.term);
  const [minPrice, setMinPrice] = useState(searchDefaults.minPrice);
  const [maxPrice, setMaxPrice] = useState(searchDefaults.maxPrice);
  const [selectedBrands, setSelectedBrands] = useState(searchDefaults.selectedBrands);
  const [selectedRatings, setSelectedRatings] = useState(searchDefaults.selectedRatings);
  const [inStockOnly, setInStockOnly] = useState(searchDefaults.inStockOnly);
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [quickViewItem, setQuickViewItem] = useState(null);
  const addItem = useCartHook((state) => state.addItem);

  const filteredProducts = useMemo(() => {
    let items = productDiscoveryItems.filter((item) => {
      const term = searchTerm.trim().toLowerCase();
      const matchesTerm =
        term.length === 0 ||
        item.name.toLowerCase().includes(term) ||
        item.brand.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term);
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(item.brand);
      const matchesRating =
        selectedRatings.length === 0 || selectedRatings.some((rating) => item.rating >= rating);
      const matchesPrice = item.price >= Number(minPrice) && item.price <= Number(maxPrice);
      return matchesTerm && matchesBrand && matchesRating && matchesPrice;
    });

    if (inStockOnly) {
      items = items.slice(0, Math.max(1, items.length));
    }

    if (sortBy === 'price-asc') {
      items = [...items].sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-desc') {
      items = [...items].sort((a, b) => b.price - a.price);
    }
    if (sortBy === 'newest') {
      items = [...items].reverse();
    }

    return items;
  }, [searchTerm, selectedBrands, selectedRatings, minPrice, maxPrice, inStockOnly, sortBy]);

  const toggleBrand = (brand) => {
    setSelectedBrands((previous) =>
      previous.includes(brand) ? previous.filter((item) => item !== brand) : [...previous, brand]
    );
  };

  const toggleRating = (rating) => {
    setSelectedRatings((previous) =>
      previous.includes(rating)
        ? previous.filter((item) => item !== rating)
        : [...previous, rating]
    );
  };

  const clearFilters = () => {
    setMinPrice(searchDefaults.minPrice);
    setMaxPrice(searchDefaults.maxPrice);
    setSelectedBrands([]);
    setSelectedRatings([]);
    setInStockOnly(false);
  };

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
      />

      <HomeDealsSection
        superDeals={superDeals}
        onQuickView={handleOpenQuickView}
        onAddToCart={handleAddFromHome}
      />

      <HomeDiscoverySection
        searchTerm={searchTerm}
        filteredProducts={filteredProducts}
        emptyStateSuggestions={emptyStateSuggestions}
        sortBy={sortBy}
        minPrice={minPrice}
        maxPrice={maxPrice}
        selectedBrands={selectedBrands}
        selectedRatings={selectedRatings}
        inStockOnly={inStockOnly}
        brands={searchDefaults.brands}
        onSearchChange={setSearchTerm}
        onSortChange={setSortBy}
        onMinPriceChange={setMinPrice}
        onMaxPriceChange={setMaxPrice}
        onToggleBrand={toggleBrand}
        onToggleRating={toggleRating}
        onToggleInStock={() => setInStockOnly((value) => !value)}
        onClearFilters={clearFilters}
        onOpenFilterModal={() => setShowFilterModal(true)}
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

      <HomeFilterModal
        isOpen={showFilterModal}
        minPrice={minPrice}
        maxPrice={maxPrice}
        selectedBrands={selectedBrands}
        selectedRatings={selectedRatings}
        inStockOnly={inStockOnly}
        brands={searchDefaults.brands}
        onClose={() => setShowFilterModal(false)}
        onMinPriceChange={setMinPrice}
        onMaxPriceChange={setMaxPrice}
        onToggleBrand={toggleBrand}
        onToggleRating={toggleRating}
        onToggleInStock={() => setInStockOnly((value) => !value)}
        onClearFilters={clearFilters}
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
