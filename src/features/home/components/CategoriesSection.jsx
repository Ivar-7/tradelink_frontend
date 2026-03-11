import { Link } from 'react-router-dom';
import { ROUTES } from '../../../shared/constants/routes';

const CATEGORIES = [
  { emoji: '📚', label: 'Textbooks',   count: '12,450 listings', color: 'indigo' },
  { emoji: '💻', label: 'Electronics', count: '8,320 listings',  color: 'purple' },
  { emoji: '🛋️', label: 'Furniture',   count: '5,890 listings',  color: 'pink'   },
  { emoji: '👕', label: 'Clothing',    count: '15,200 listings', color: 'emerald'},
];

const colorMap = {
  indigo:  { card: 'bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 border-indigo-500/20',   icon: 'bg-indigo-500/20'  },
  purple:  { card: 'bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20',   icon: 'bg-purple-500/20'  },
  pink:    { card: 'bg-gradient-to-br from-pink-500/10 to-pink-500/5 border-pink-500/20',         icon: 'bg-pink-500/20'    },
  emerald: { card: 'bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20',icon: 'bg-emerald-500/20' },
};

const CategoriesSection = () => (
  <section id="features" className="w-full px-6 py-16 lg:px-12">
    <div className="max-w-screen-2xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Popular Categories</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Find exactly what you need or list items you no longer use. Everything from textbooks to tech.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
        {CATEGORIES.map(({ emoji, label, count, color }) => (
          <Link
            key={label}
            to={ROUTES.PRODUCTS}
            className={`category-card card-glow p-6 rounded-2xl border cursor-pointer ${colorMap[color].card}`}
          >
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl mb-4 ${colorMap[color].icon}`}>
              {emoji}
            </div>
            <h3 className="font-semibold text-lg mb-1 text-white">{label}</h3>
            <p className="text-sm text-slate-400">{count}</p>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default CategoriesSection;
