import { Link } from 'react-router-dom';
import { ROUTES } from '../../../shared/constants/routes';

const CTASection = () => (
  <section className="w-full px-6 py-16 lg:px-12">
    <div className="max-w-3xl mx-auto text-center">
      <div className="p-12 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Start Trading?</h2>
        <p className="text-slate-300 mb-8 max-w-xl mx-auto">
          Join thousands of students already saving money and making connections on TradeLink.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to={ROUTES.AUTH.SIGNUP}
            className="btn-cta px-8 py-4 rounded-xl font-semibold text-lg text-white text-center"
          >
            Create Free Account
          </Link>
          <Link
            to={ROUTES.PRODUCTS}
            className="px-8 py-4 rounded-xl font-semibold text-lg border border-white/20 hover:bg-white/5 transition-colors text-center text-white"
          >
            Browse Listings
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default CTASection;
