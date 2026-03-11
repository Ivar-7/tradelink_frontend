const SignupForm = ({ onSubmit, loading, error }) => {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="user_fname" className="text-sm font-medium text-foreground">First name</label>
          <input
            id="user_fname"
            name="user_fname"
            type="text"
            required
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="user_lname" className="text-sm font-medium text-foreground">Last name</label>
          <input
            id="user_lname"
            name="user_lname"
            type="text"
            required
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
          required
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="@username"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="user_email" className="text-sm font-medium text-foreground">Email</label>
        <input
          id="user_email"
          name="user_email"
          type="email"
          required
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="you@example.com"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="user_role" className="text-sm font-medium text-foreground">I want to</label>
        <select
          id="user_role"
          name="user_role"
          defaultValue="buyer"
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="buyer">Buy products</option>
          <option value="vendor">Sell products (Vendor)</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="user_password" className="text-sm font-medium text-foreground">Password</label>
        <input
          id="user_password"
          name="user_password"
          type="password"
          required
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="••••••••"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="confirm_password" className="text-sm font-medium text-foreground">Confirm password</label>
        <input
          id="confirm_password"
          name="confirm_password"
          type="password"
          required
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="••••••••"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-primary-600 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
      >
        {loading ? 'Creating account…' : 'Create Account'}
      </button>
    </form>
  );
};

export default SignupForm;
