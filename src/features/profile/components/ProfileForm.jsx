import { KENYA_COUNTIES } from '../../../shared/constants/app';

const ProfileForm = ({ profile, onSubmit, loading, error }) => {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="user_fname" className="text-sm font-medium text-foreground">First name</label>
          <input
            id="user_fname"
            name="user_fname"
            type="text"
            defaultValue={profile?.user_fname ?? ''}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="user_lname" className="text-sm font-medium text-foreground">Last name</label>
          <input
            id="user_lname"
            name="user_lname"
            type="text"
            defaultValue={profile?.user_lname ?? ''}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="username" className="text-sm font-medium text-foreground">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          defaultValue={profile?.username ?? ''}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <fieldset className="rounded-xl border border-border p-4">
        <legend className="px-1 text-sm font-semibold text-foreground">Delivery Address</legend>
        <div className="mt-3 flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="county" className="text-sm font-medium text-foreground">County</label>
            <select
              id="county"
              name="county"
              defaultValue={profile?.delivery_address?.county ?? ''}
              className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="" disabled>Select county</option>
              {KENYA_COUNTIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="city" className="text-sm font-medium text-foreground">City / Town</label>
            <input
              id="city"
              name="city"
              type="text"
              defaultValue={profile?.delivery_address?.city ?? ''}
              className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="user_contact" className="text-sm font-medium text-foreground">Phone Number</label>
            <input
              id="user_contact"
              name="user_contact"
              type="tel"
              defaultValue={profile?.delivery_address?.user_contact ?? ''}
              className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="07XXXXXXXX"
            />
          </div>
        </div>
      </fieldset>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-primary-600 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
      >
        {loading ? 'Saving…' : 'Save Changes'}
      </button>
    </form>
  );
};

export default ProfileForm;
