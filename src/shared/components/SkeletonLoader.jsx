/**
 * Generic skeleton loader block.
 * @param {{ className?: string }} props
 */
const SkeletonLoader = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse rounded-lg bg-border ${className}`}
      aria-label="Loading..."
      role="status"
    />
  );
};

export const ProductCardSkeleton = () => (
  <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4">
    <SkeletonLoader className="h-48 w-full" />
    <SkeletonLoader className="h-4 w-3/4" />
    <SkeletonLoader className="h-4 w-1/2" />
    <SkeletonLoader className="h-8 w-full" />
  </div>
);

export default SkeletonLoader;
