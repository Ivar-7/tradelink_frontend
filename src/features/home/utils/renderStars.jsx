export const renderStars = (rating, sizeClass = 'text-sm') => {
  const full = Math.floor(rating ?? 0);
  return Array.from({ length: 5 }).map((_, index) => (
    <span
      key={`${rating ?? 0}-${index}`}
      className={`${sizeClass} ${index < full ? 'text-amber-500' : 'text-slate-300 dark:text-slate-700'}`}
      aria-hidden="true"
    >
      ★
    </span>
  ));
};
