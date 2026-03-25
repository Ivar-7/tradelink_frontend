import camera from '../../../assets/images/camera.jpg';
import cctv from '../../../assets/images/cctv.jpg';
import smartwatch from '../../../assets/images/smartwatch.jpg';
import headphone from '../../../assets/images/headphone.jpg';
import cameraa from '../../../assets/images/cameraa.jpg';
import laptopPro from '../../../assets/images/laptop pro.jpg';
import tablet from '../../../assets/images/tablet.jpg';
import iphone from '../../../assets/images/iphone.jpg';
import speaker from '../../../assets/images/speaker.jpg';
import headPhoneee from '../../../assets/images/headphoneee.jpg';
import VRheadset from '../../../assets/images/VR headset.jpg';
import iphone12 from '../../../assets/images/iphone12.jpg';
import photo from '../../../assets/images/photo.jpg';
import macbook from '../../../assets/images/macbook .jpg';

export const productCatalog = [
  {
    id: 'prod-001',
    name: 'Wireless Headphones',
    image: VRheadset,
    price: 79.99,
    description: 'High-quality wireless headphones for immersive sound.',
    brand: 'Lunar',
  },
  {
    id: 'prod-002',
    name: 'Smart Watch',
    image: smartwatch,
    price: 129.99,
    description: 'Keep track of your health and notifications on the go.',
    brand: 'Studio',
  },
  {
    id: 'prod-003',
    name: 'Bluetooth Speaker',
    image: speaker,
    price: 59.99,
    description: 'Portable speaker with powerful Bluetooth audio.',
    brand: 'Pulse',
  },
  {
    id: 'prod-004',
    name: 'iPhone',
    image: iphone,
    price: 39.99,
    description: 'Sleek smartphone with advanced features.',
    brand: 'Apple',
  },
  {
    id: 'prod-005',
    name: 'Headphone Lite',
    image: headPhoneee,
    price: 29.99,
    description: 'Affordable headphones for everyday listening.',
    brand: 'Echo',
  },
  {
    id: 'prod-006',
    name: 'Headphone Pro',
    image: headPhoneee,
    price: 89.99,
    description: 'Premium headphones with clear sound quality.',
    brand: 'Echo',
  },
  {
    id: 'prod-007',
    name: 'Compact Camera',
    image: cameraa,
    price: 24.99,
    description: 'Compact camera perfect for casual photography.',
    brand: 'Sony',
  },
  {
    id: 'prod-008',
    name: 'Tablet',
    image: tablet,
    price: 34.99,
    description: 'Lightweight tablet ideal for browsing and media.',
    brand: 'Skyline',
  },
  {
    id: 'prod-009',
    name: 'Photo Storage Kit',
    image: photo,
    price: 49.99,
    description: 'High-resolution photo prints or digital storage.',
    brand: 'Pixel',
  },
  {
    id: 'prod-010',
    name: 'Macbook',
    image: macbook,
    price: 99.99,
    description: 'Powerful laptop for work and creative projects.',
    brand: 'Apple',
  },
  {
    id: 'prod-011',
    name: 'Laptop',
    image: laptopPro,
    price: 19.99,
    description: 'Reliable laptop for everyday tasks.',
    brand: 'Nova',
  },
  {
    id: 'prod-012',
    name: 'Laptop Pro',
    image: laptopPro,
    price: 27.99,
    description: 'Enhanced laptop with better performance and features.',
    brand: 'Nova',
  },
  {
    id: 'prod-013',
    name: 'iPhone Max',
    image: iphone,
    price: 149.99,
    description: 'Latest iPhone model with advanced camera.',
    brand: 'Apple',
  },
  {
    id: 'prod-014',
    name: 'Headphones',
    image: headphone,
    price: 69.99,
    description: 'Comfortable headphones with rich sound.',
    brand: 'Lunar',
  },
  {
    id: 'prod-015',
    name: 'Action Camera',
    image: camera,
    price: 199.99,
    description: 'Durable camera for outdoor and action sports.',
    brand: 'Sony',
  },
  {
    id: 'prod-016',
    name: 'iPhone 12',
    image: iphone12,
    price: 22.99,
    description: 'Classic iPhone 12 model with sleek design.',
    brand: 'Apple',
  },
  {
    id: 'prod-017',
    name: 'CCTV Camera',
    image: cctv,
    price: 15.8,
    description: 'Security camera for home or monitoring.',
    brand: 'SecureCam',
  },
  {
    id: 'prod-018',
    name: 'Laptop Air',
    image: laptopPro,
    price: 32.99,
    description: 'Compact laptop suitable for work and study.',
    brand: 'Nova',
  },
];

export const getCatalogProductById = (id) => productCatalog.find((product) => product.id === id);
