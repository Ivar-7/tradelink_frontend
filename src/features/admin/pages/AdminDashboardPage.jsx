import useAdminHook from '../hooks/useAdminHook';
import AdminStats from '../components/AdminStats';
import SkeletonLoader from '../../../shared/components/SkeletonLoader';

const AdminDashboardPage = () => {
  const { stats, loading, error } = useAdminHook();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-foreground">Admin Dashboard</h1>

      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

      {loading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 7 }).map((_, i) => <SkeletonLoader key={i} className="h-24 w-full" />)}
        </div>
      ) : (
        <AdminStats stats={stats} />
      )}
    </div>
  );
};

export default AdminDashboardPage;
