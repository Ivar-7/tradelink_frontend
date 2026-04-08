import productsData from './products.json';

const productImages = import.meta.glob('../../../assets/images/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
});

const resolveProductImage = (imageFile) => productImages[`../../../assets/images/${imageFile}`] ?? '';

export const productCatalog = productsData.map(({ imageFile, ...product }) => ({
  ...product,
  image: resolveProductImage(imageFile),
}));

export const getCatalogProductById = (id) => productCatalog.find((product) => product.id === id);
