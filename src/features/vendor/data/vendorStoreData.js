import { productCatalog } from '../../products/data/productCatalog';

const vendorProductsStorageKey = 'tradelink-local-vendor-products';

export const vendorStoreFilters = {
  categories: ['Headphones', 'Cameras', 'Displays', 'Gaming'],
  ratings: ['5.0', '4.0 & Up'],
};

export const seedVendorProducts = () => {
  const sonyProducts = productCatalog
    .filter((item) => item.brand.toLowerCase() === 'sony')
    .map((item, index) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      image_url: item.image,
      price: item.price,
      stock_quantity: 6 + index * 3,
      category_id: index % 2 === 0 ? 'cameras' : 'accessories',
      vendor_id: 'vendor-sony',
      is_active: true,
      rating: index % 2 === 0 ? 4.8 : 4.5,
      reviews_count: 48 + index * 20,
      featured: index === 0,
    }));

  if (sonyProducts.length) {
    return sonyProducts;
  }

  return [
    {
      id: 'vendor-prod-001',
      name: 'Sony Studio Audio Monitor',
      description: 'Premium studio monitoring headphones with clean detail response.',
      image_url: productCatalog[0]?.image ?? '',
      price: 199.99,
      stock_quantity: 8,
      category_id: 'headphones',
      vendor_id: 'vendor-sony',
      is_active: true,
      rating: 4.7,
      reviews_count: 61,
      featured: true,
    },
  ];
};

export const getVendorProductsStorageKey = () => vendorProductsStorageKey;
