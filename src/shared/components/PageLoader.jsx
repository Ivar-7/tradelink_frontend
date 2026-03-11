import SkeletonLoader from './SkeletonLoader';

const PageLoader = () => (
  <div className="mx-auto max-w-7xl px-4 py-10">
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <SkeletonLoader key={i} className="h-64 w-full" />
      ))}
    </div>
  </div>
);

export default PageLoader;
