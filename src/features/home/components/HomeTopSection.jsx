const HomeTopSection = ({ topCategories, heroFeature, heroPerks }) => {
  return (
    <section className="mt-2 grid grid-cols-1 gap-6 lg:grid-cols-12">
      <aside className="rounded-2xl border border-border bg-surface p-4 shadow-sm lg:col-span-2">
        <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-muted">Categories</h3>
        <ul className="space-y-1">
          {topCategories.map((category) => (
            <li
              key={category.label}
              className="group flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              <span className="text-primary-600 transition-transform group-hover:scale-110">●</span>
              <span className="text-sm font-medium text-foreground">{category.label}</span>
            </li>
          ))}
        </ul>
      </aside>

      <div className="relative overflow-hidden rounded-2xl lg:col-span-8">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-700 to-primary-500" />
        <img
          src={heroFeature.image}
          alt="Hero spotlight"
          className="absolute inset-0 h-full w-full object-cover opacity-50 mix-blend-overlay"
        />
        <div className="relative z-10 flex min-h-[360px] flex-col justify-center px-8 py-12 md:px-16">
          <span className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-white/80">
            {heroFeature.badge}
          </span>
          <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-white md:text-6xl">
            {heroFeature.title}
          </h1>
          <p className="mb-8 mt-4 max-w-xl text-base text-white/90 md:text-lg">{heroFeature.subtitle}</p>
          <button
            type="button"
            className="w-fit rounded-xl bg-white px-8 py-3 text-sm font-bold text-primary-700 transition-colors hover:bg-slate-100"
          >
            {heroFeature.cta}
          </button>
        </div>
      </div>

      <aside className="flex flex-col gap-6 lg:col-span-2">
        <div className="rounded-2xl border border-border bg-surface p-5 text-center shadow-sm">
          <div className="mx-auto mb-4 h-16 w-16 overflow-hidden rounded-full border-2 border-primary-200 bg-slate-200" />
          <p className="mb-5 text-sm font-semibold italic text-foreground">{heroPerks.welcomeText}</p>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" className="rounded-lg bg-primary-600 py-2 text-xs font-bold text-white">
              Join
            </button>
            <button
              type="button"
              className="rounded-lg bg-slate-100 py-2 text-xs font-bold text-foreground dark:bg-slate-900"
            >
              Sign In
            </button>
          </div>
        </div>

        <div className="relative flex-1 overflow-hidden rounded-2xl bg-orange-100 p-5 dark:bg-orange-900/30">
          <h4 className="text-xl font-black leading-tight text-orange-900 dark:text-orange-200">
            {heroPerks.promoTitle}
          </h4>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-3xl font-bold text-orange-700 dark:text-orange-300">{heroPerks.promoPrice}</span>
            <span className="text-xs font-semibold text-orange-800/70 dark:text-orange-300/80">{heroPerks.promoLabel}</span>
          </div>
          <button
            type="button"
            className="mt-6 w-full rounded-lg bg-orange-700 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90"
          >
            Claim Reward
          </button>
        </div>
      </aside>
    </section>
  );
};

export default HomeTopSection;
