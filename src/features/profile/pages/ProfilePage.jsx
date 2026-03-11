import useProfileHook from '../hooks/useProfileHook';
import ProfileForm from '../components/ProfileForm';
import SkeletonLoader from '../../../shared/components/SkeletonLoader';

const ProfilePage = () => {
  const { profile, loading, error, save } = useProfileHook();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await save({
        user_fname: formData.get('user_fname') || undefined,
        user_lname: formData.get('user_lname') || undefined,
        username: formData.get('username') || undefined,
        delivery_address: {
          country: 'Kenya',
          county: formData.get('county'),
          city: formData.get('city'),
          postal_address: '',
          user_email: profile?.user_email ?? '',
          user_contact: formData.get('user_contact'),
        },
      });
    } catch {
      // error state handled in hook
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-foreground">My Profile</h1>

      {loading && !profile ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonLoader key={i} className="h-10 w-full" />)}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-surface p-6">
          <ProfileForm profile={profile} onSubmit={handleSubmit} loading={loading} error={error} />
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
