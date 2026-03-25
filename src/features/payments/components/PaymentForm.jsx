// src/components/PaymentForm.jsx
import { useState } from 'react';

const PaymentForm = ({ 
  initialPhone = '', 
  initialName = '', 
  initialEmail = '', 
  amount, 
  onSubmit, 
  loading 
}) => {
  const [formData, setFormData] = useState({
    fullName: initialName,
    email: initialEmail,
    phoneNumber: initialPhone,
    pickupLocation: ''
  });
  const [errors, setErrors] = useState({});
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  // Mtaani pickup locations across Kenya
  const pickupLocations = [
    'Nairobi CBD - Mtaani Point (Kimathi Street)',
    'Westlands - Mtaani Hub (Sarit Centre)',
    'Kilimani - Mtaani Spot (Yaya Centre)',
    'Eastlands - Mtaani Base (Buruburu)',
    'South B - Mtaani Corner',
    'South C - Mtaani Lounge',
    'Langata - Mtaani Square (The Junction)',
    'Karen - Mtaani Gardens',
    'Rongai - Mtaani Center',
    'Thika - Mtaani Depot',
    'Kiambu - Mtaani Station',
    'Machakos - Mtaani Point',
    'Nakuru - Mtaani Hub',
    'Kisumu - Mtaani Base',
    'Mombasa - Mtaani Beachfront',
    'Eldoret - Mtaani Plaza',
    'Nyeri - Mtaani Center'
  ];

  const validate = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^(254|0|\+254)(7|1)\d{8}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Enter a valid Kenyan phone number (e.g., 254712345678)';
    }
    
    if (!formData.pickupLocation) {
      newErrors.pickupLocation = 'Please select a pickup location';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    let formattedPhone = formData.phoneNumber;
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.substring(1);
    } else if (formattedPhone.startsWith('+')) {
      formattedPhone = formattedPhone.substring(1);
    }
    
    onSubmit({ 
      phoneNumber: formattedPhone, 
      customerName: formData.fullName, 
      email: formData.email,
      pickupLocation: formData.pickupLocation
    });
  };

  const handlePromoApply = () => {
    if (promoCode === 'WELCOME10') {
      setPromoApplied(true);
      alert('✅ Promo code applied! 10% discount added.');
    } else if (promoCode === 'MTAANI25') {
      setPromoApplied(true);
      alert('✅ Promo code applied! 25% discount added.');
    } else {
      alert('❌ Invalid promo code');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Sample cart items - replace with your actual cart data
  const cartItems = [
    { name: 'Studio X1 Wireless', quantity: 1, price: 39900, variant: 'Midnight Black' },
    { name: 'Lunar Series 04', quantity: 1, price: 25000, variant: 'Titanium / White' }
  ];
  
  const subtotal = 64900;
  const discount = promoApplied ? (promoCode === 'WELCOME10' ? subtotal * 0.1 : subtotal * 0.25) : 0;
  const total = subtotal - discount;

  return (
    <div>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center pb-8 border-b border-gray-200 mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">TradeLink</h1>
          <a href="/cart" className="text-sm text-gray-600 hover:text-gray-900 transition">
            ← Back to Cart
          </a>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
          {/* Form Section */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit}>
              <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Secure Checkout</h2>
                
                <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900 ${
                      errors.fullName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="+254 712 345 678"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900 ${
                      errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                  )}
                </div>

                {/* Pickup Location Section */}
                <h3 className="text-lg font-medium text-gray-900 mb-4 mt-6">Pickup Location</h3>
                
                <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-2 mb-3">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-sm text-blue-800">
                      <span className="font-semibold">Pick Up Mtaani</span><br />
                      Select your nearest pickup point. You'll receive an SMS with pickup instructions after payment.
                    </p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Pickup Location <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="pickupLocation"
                    value={formData.pickupLocation}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900 ${
                      errors.pickupLocation ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Choose your nearest Mtaani pickup point</option>
                    {pickupLocations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                  {errors.pickupLocation && (
                    <p className="mt-1 text-sm text-red-600">{errors.pickupLocation}</p>
                  )}
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-2">Payment Method: M-Pesa</h3>
                  <p className="text-sm text-gray-600">
                    Once you click "Pay with M-Pesa", a secure STK push will be sent to the phone number provided above. 
                    Please enter your M-Pesa PIN on your phone to complete the transaction.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  'Pay with M-Pesa →'
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5 mt-8 lg:mt-0">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-4">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start py-2 border-b border-gray-200">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.variant}</p>
                      <p className="text-xs text-gray-400">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-gray-900">KES {item.price.toLocaleString()}</p>
                  </div>
                ))}
                
                <div className="pt-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Add promo code (WELCOME10 or MTAANI25)"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                    />
                    <button
                      type="button"
                      onClick={handlePromoApply}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm font-medium"
                    >
                      Apply
                    </button>
                  </div>
                </div>
                
                <div className="pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">KES {subtotal.toLocaleString()}</span>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount ({promoCode === 'WELCOME10' ? '10%' : '25%'})</span>
                      <span>- KES {discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Pickup Fee</span>
                    <span className="text-green-600 font-medium">FREE</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taxes</span>
                    <span className="text-gray-900">KES 0.00</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold pt-4 border-t border-gray-200">
                    <span className="text-gray-900">TOTAL TO PAY</span>
                    <span className="text-gray-900">KES {total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    <span>Pick up at your selected Mtaani point within 2-3 business days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;