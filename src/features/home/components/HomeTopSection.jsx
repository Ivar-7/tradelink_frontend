import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../shared/constants/routes';

const HomeTopSection = ({ topCategories, categoriesLoading, heroFeature, heroPerks, currentUser }) => {
  const [current, setCurrent] = useState(0);
  const timer = useRef(null);
  const isLoggedIn = Boolean(currentUser);
  const displayName =
    currentUser?.first_name?.trim() || currentUser?.username || currentUser?.email || 'Guest';
  const welcomeText = isLoggedIn
    ? `Welcome to TradeLink, ${displayName}`
    : heroPerks.welcomeText;

  // Auto‑slide every 5 seconds
  useEffect(() => {
    timer.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroFeature.length);
    }, 5000);
    return () => clearInterval(timer.current);
  }, [heroFeature.length]);

  const goToSlide = (index) => {
    setCurrent(index);
    // Reset the timer after manual navigation
    clearInterval(timer.current);
    timer.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroFeature.length);
    }, 5000);
  };

  const nextSlide = () => {
    goToSlide((current + 1) % heroFeature.length);
  };

  const prevSlide = () => {
    goToSlide((current - 1 + heroFeature.length) % heroFeature.length);
  };

  return (
    <section className="mt-2 grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Categories sidebar */}
      <aside className="rounded-2xl border border-border bg-surface p-4 shadow-sm lg:col-span-2">
        <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-muted">Categories</h3>
        <ul className="space-y-1">
          {categoriesLoading ? (
            <li className="rounded-lg p-2 text-sm text-muted">Loading categories...</li>
          ) : null}

          {!categoriesLoading && !topCategories.length ? (
            <li className="rounded-lg p-2 text-sm text-muted">No categories available yet.</li>
          ) : null}

          {!categoriesLoading && topCategories.map((category) => (
            <li
              key={category.label}
              className="group flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              <span className="text-primary-600 transition-transform group-hover:scale-110">{category.icon}</span>
              <span className="text-sm font-medium text-foreground">{category.label}</span>
            </li>
          ))}
        </ul>
      </aside>

      {/* Hero slider area */}
      <div className="relative overflow-hidden rounded-2xl lg:col-span-8">
        {/* Background gradient layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-700 to-primary-500 z-0" />

        {/* Slides */}
        <div className='relative overflow-hidden rounded-2xl lg:col-span-8 min-h-[360px] h-auto'/>
        {heroFeature.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.badge}
              className="absolute inset-0 h-full w-full object-cover opacity-50 mix-blend-overlay"
            />
            <div className="relative z-20 flex min-h-[360px] flex-col justify-center px-8 py-12 md:px-16">
              <span className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-white/80">
                {slide.badge}
              </span>
              <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-white md:text-6xl">
                {slide.title}
              </h1>
              <p className="mb-8 mt-4 max-w-xl text-base text-white/90 md:text-lg">
                {slide.subtitle || slide.sub}
              </p>
              <button
                type="button"
                className="w-fit rounded-xl bg-white px-8 py-3 text-sm font-bold text-primary-700 transition-colors hover:bg-slate-100"
              >
                {slide.cta}
              </button>
            </div>
          </div>
        ))}

        {/* Previous button */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Previous slide"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-5 w-5 md:h-6 md:w-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        {/* Next button */}
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Next slide"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-5 w-5 md:h-6 md:w-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>

        {/* Dots navigation */}
        <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center gap-2">
          {heroFeature.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === current ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Perks sidebar */}
      <aside className="flex flex-col gap-6 lg:col-span-2">
        <div className="rounded-2xl border border-border bg-surface p-5 text-center shadow-sm">
          <div className="mx-auto mb-4 h-16 w-16 overflow-hidden rounded-full border-2 border-primary-200 bg-slate-200">
            {heroPerks.avatarImage ? (
              <img
                src={heroPerks.avatarImage}
                alt="Atelier profile"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl">🛍</div>
            )}
          </div>
          <p className="mb-5 text-sm font-semibold italic text-foreground">{welcomeText}</p>
          {!isLoggedIn && (
            <div className="grid grid-cols-2 gap-2">
              <Link
                to={ROUTES.AUTH.SIGNUP}
                className="rounded-lg bg-primary-600 py-2 text-center text-xs font-bold text-white"
              >
                Join
              </Link>
              <Link
                to={ROUTES.AUTH.LOGIN}
                className="rounded-lg bg-slate-100 py-2 text-center text-xs font-bold text-foreground dark:bg-slate-900"
              >
                Sign In
              </Link>
            </div>
          )}
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