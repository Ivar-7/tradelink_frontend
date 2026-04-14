import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  productDiscoveryItems,
  quickViewProduct,
  searchDefaults,
  emptyStateSuggestions,
} from '../data/homePageData';
import useCartHook from '../../cart/hooks/useCartHook';
import HomeDiscoverySection from '../components/HomeDiscoverySection';
import HomeFilterModal from '../components/HomeFilterModal';
import HomeQuickViewModal from '../components/HomeQuickViewModal';
import { resolveCatalogProductId } from '../utils/homeProductRouting';
import { useAuthHook } from '../../auth/hooks/useAuthHook';
import { useToast } from '../../../shared/hooks/useToastHook';
import { ROUTES } from '../../../shared/constants/routes';

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') ?? '');
  const [minPrice, setMinPrice] = useState(searchDefaults.minPrice);
  const [maxPrice, setMaxPrice] = useState(searchDefaults.maxPrice);
  const [selectedBrands, setSelectedBrands] = useState(searchDefaults.selectedBrands);
  const [selectedRatings, setSelectedRatings] = useState(searchDefaults.selectedRatings);
  const [inStockOnly, setInStockOnly] = useState(searchDefaults.inStockOnly);
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [quickViewItem, setQuickViewItem] = useState(null);
  const addItem = useCartHook((state) => state.addItem);
  const { user } = useAuthHook();
  const { addToast } = useToast();

  useEffect(() => {
    setSearchTerm(searchParams.get('q') ?? '');
  }, [searchParams]);

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

  const handleAddToCart = async (itemOrId) => {
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

  const handleSearchChange = (value) => {
    setSearchTerm(value);

    const nextParams = new URLSearchParams(searchParams);
    const normalizedValue = value.trim();

    if (normalizedValue) {
      nextParams.set('q', normalizedValue);
    } else {
      nextParams.delete('q');
    }

    setSearchParams(nextParams, { replace: true });
  };

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 pb-16 pt-8 text-foreground lg:px-6">
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
        onSearchChange={handleSearchChange}
        onSortChange={setSortBy}
        onMinPriceChange={setMinPrice}
        onMaxPriceChange={setMaxPrice}
        onToggleBrand={toggleBrand}
        onToggleRating={toggleRating}
        onToggleInStock={() => setInStockOnly((value) => !value)}
        onClearFilters={clearFilters}
        onOpenFilterModal={() => setShowFilterModal(true)}
        onQuickView={handleOpenQuickView}
        onAddToCart={handleAddToCart}
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
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};

export default SearchPage;
