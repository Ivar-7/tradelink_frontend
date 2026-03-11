const FEATURES = [
  {
    title: 'Verified Students Only',
    description:
      "Every user is verified with their .edu email. Trade with confidence knowing you're dealing with real students.",
    iconBg: 'bg-indigo-500/20',
    icon: (
      <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
  },
  {
    title: 'Campus Meetups',
    description:
      'Meet safely on campus to exchange items. Our suggested spots make transactions easy and secure.',
    iconBg: 'bg-purple-500/20',
    icon: (
      <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: 'Zero Listing Fees',
    description: "List unlimited items for free. We believe students shouldn't pay to sell their stuff.",
    iconBg: 'bg-pink-500/20',
    icon: (
      <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
];

const FeaturesSection = () => (
  <section id="how-it-works" className="w-full px-6 py-16 lg:px-12">
    <div className="max-w-screen-2xl mx-auto">
      <div className="grid md:grid-cols-3 gap-8">
        {FEATURES.map(({ title, description, iconBg, icon }) => (
          <div key={title} className="p-8 rounded-2xl bg-white/5 border border-white/10">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${iconBg}`}>
              {icon}
            </div>
            <h3 className="text-xl font-semibold mb-3">{title}</h3>
            <p className="text-slate-400">{description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
