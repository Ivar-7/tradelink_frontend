import { Link } from 'react-router-dom';
import { ROUTES } from '../../../shared/constants/routes';

const HeroSection = () => (
  <section className="w-full px-6 py-12 lg:px-12 lg:py-20">
    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
      {/* Left: text content */}
      <div className="fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm text-slate-300">10,000+ students already trading</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
          Buy &amp; Sell Within Your{' '}
          <span className="text-gradient">Campus Community</span>
        </h1>

        <p className="text-lg text-slate-400 mb-8 max-w-lg">
          The trusted marketplace for students. Trade textbooks, electronics, furniture, and more
          with verified students at your university.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to={ROUTES.PRODUCTS}
            className="btn-cta px-8 py-4 rounded-xl font-semibold text-lg text-white text-center"
          >
            Start Shopping
          </Link>
          <button className="px-8 py-4 rounded-xl font-semibold text-lg border border-white/20 hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Watch Demo
          </button>
        </div>

        <div className="flex items-center gap-8 mt-10">
          <div>
            <div className="text-2xl font-bold">50K+</div>
            <div className="text-sm text-slate-400">Active Listings</div>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div>
            <div className="text-2xl font-bold">200+</div>
            <div className="text-sm text-slate-400">Universities</div>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div>
            <div className="text-2xl font-bold">4.9★</div>
            <div className="text-sm text-slate-400">User Rating</div>
          </div>
        </div>
      </div>

      {/* Right: floating product cards */}
      <div className="relative hidden lg:block h-96">
        <div className="floating absolute -top-4 -left-4 w-64 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 p-4 shadow-2xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-xl">
              📚
            </div>
            <div>
              <div className="font-medium text-sm">Calculus Textbook</div>
              <div className="text-xs text-slate-400">Like new condition</div>
            </div>
          </div>
          <div className="text-2xl font-bold text-green-400">$45</div>
          <div className="text-xs text-slate-500 line-through">$120 retail</div>
        </div>

        <div className="floating-delayed absolute top-20 right-0 w-56 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 p-4 shadow-2xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-xl">
              🎧
            </div>
            <div>
              <div className="font-medium text-sm">AirPods Pro</div>
              <div className="text-xs text-slate-400">Gently used</div>
            </div>
          </div>
          <div className="text-2xl font-bold text-green-400">$89</div>
          <div className="text-xs text-slate-500 line-through">$249 retail</div>
        </div>

        <div className="floating absolute bottom-0 left-12 w-60 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 p-4 shadow-2xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center text-xl">
              🪑
            </div>
            <div>
              <div className="font-medium text-sm">Desk Chair</div>
              <div className="text-xs text-slate-400">Perfect for dorms</div>
            </div>
          </div>
          <div className="text-2xl font-bold text-green-400">$35</div>
          <div className="text-xs text-slate-500 line-through">$80 retail</div>
        </div>

        {/* Decorative blurs */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="pointer-events-none absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-purple-500/10 blur-3xl" />
      </div>
    </div>
  </section>
);

export default HeroSection;
