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

const products = [
  {
    id: 1,
    name: 'Wireless Headphones',
    image: VRheadset,
    price: 79.99,
    description: 'High-quality wireless headphones for immersive sound.',
  },
  {
    id: 2,
    name: 'Smart Watch',
    image: smartwatch,
    price: 129.99,
    description: 'Keep track of your health and notifications on the go.',
  },
  {
    id: 3,
    name: 'Bluetooth Speaker',
    image: speaker,
    price: 59.99,
    description: 'Portable speaker with powerful Bluetooth audio.',
  },
  {
    id: 4,
    name: 'iPhone',
    image: iphone,
    price: 39.99,
    description: 'Sleek smartphone with advanced features.',
  },
  {
    id: 5,
    name: 'Headphone',
    image: headPhoneee,
    price: 29.99,
    description: 'Affordable headphones for everyday listening.',
  },
  {
    id: 6,
    name: 'Headphone',
    image: headPhoneee,
    price: 89.99,
    description: 'Premium headphones with clear sound quality.',
  },
  {
    id: 7,
    name: 'Camera',
    image: cameraa,
    price: 24.99,
    description: 'Compact camera perfect for casual photography.',
  },
  {
    id: 8,
    name: 'Tablet',
    image: tablet,
    price: 34.99,
    description: 'Lightweight tablet ideal for browsing and media.',
  },
  {
    id: 9,
    name: 'Photo',
    image: photo,
    price: 49.99,
    description: 'High-resolution photo prints or digital storage.',
  },
  {
    id: 10,
    name: 'Macbook',
    image: macbook,
    price: 99.99,
    description: 'Powerful laptop for work and creative projects.',
  },
  {
    id: 11,
    name: 'Laptop',
    image: laptopPro,
    price: 19.99,
    description: 'Reliable laptop for everyday tasks.',
  },
  {
    id: 12,
    name: 'Laptop Pro',
    image: laptopPro,
    price: 27.99,
    description: 'Enhanced laptop with better performance and features.',
  },
  {
    id: 13,
    name: 'iPhone',
    image: iphone,
    price: 149.99,
    description: 'Latest iPhone model with advanced camera.',
  },
  {
    id: 14,
    name: 'Headphones',
    image: headphone,
    price: 69.99,
    description: 'Comfortable headphones with rich sound.',
  },
  {
    id: 15,
    name: 'Action Camera',
    image: camera,
    price: 199.99,
    description: 'Durable camera for outdoor and action sports.',
  },
  {
    id: 16,
    name: 'iPhone 12',
    image: iphone12,
    price: 22.99,
    description: 'Classic iPhone 12 model with sleek design.',
  },
  {
    id: 17,
    name: 'CCTV Camera',
    image: cctv,
    price: 15.8,
    description: 'Security camera for home or monitoring.',
  },
  {
    id: 18,
    name: 'Laptop',
    image: laptopPro,
    price: 32.99,
    description: 'Compact laptop suitable for work and study.',
  },
];

const ProductsPage = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
    {products.map((product) => (
      <div
        key={product.id}
        className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden"
      >
        <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover hover:scale-110 transition duration-300"
          />
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>

          <p className="text-gray-500 text-sm mt-1">{product.description}</p>

          <div className="flex items-center justify-between mt-4">
            <span className="text-xl font-bold text-black">${product.price}</span>

            <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition">
              Add
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default ProductsPage;
