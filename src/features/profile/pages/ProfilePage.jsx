import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import useProfileHook from '../hooks/useProfileHook';
import usePaymentsHook from '../../payments/hooks/usePaymentsHook';
import { getOrders } from '../../orders/api/ordersApi';
import useCartHook from '../../cart/hooks/useCartHook';
import { useAuthHook } from '../../auth/hooks/useAuthHook';
import { formatCurrency } from '../../../shared/utils/formatters';
import { ROUTES } from '../../../shared/constants/routes';

const tabs = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'profile', label: 'Profile Information' },
  { key: 'notifications', label: 'Notification Preferences' },
  { key: 'privacy', label: 'Data & Privacy' },
  { key: 'addresses', label: 'Address Book' },
];

const ProfilePage = () => {
  const {
    profile,
    loading,
    error,
    save,
    addAddress,
    removeAddress,
    setDefaultAddress,
    saveNotifications,
    savePrivacy,
    exportData,
  } = useProfileHook();
  const { methods, fetchMethods } = usePaymentsHook();
  const cart = useCartHook((state) => state.cart);
  const fetchCart = useCartHook((state) => state.fetchCart);
  const { logout } = useAuthHook();

  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [message, setMessage] = useState('');
  const [showCookieModal, setShowCookieModal] = useState(false);

  const [profileForm, setProfileForm] = useState({
    user_fname: '',
    user_lname: '',
    username: '',
    user_email: '',
    user_phone: '',
  });

  const [newAddress, setNewAddress] = useState({
    label: '',
    country: 'Kenya',
    county: 'Nairobi',
    city: '',
    line1: '',
    postal_address: '',
    user_email: '',
    user_contact: '',
  });

  const [notifications, setNotifications] = useState({
    order_updates: true,
    marketing_emails: false,
    price_drop_alerts: true,
  });

  const [privacy, setPrivacy] = useState({
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    fetchMethods();
    fetchCart();
    getOrders('all').then((result) => setOrders(result.orders)).catch(() => setOrders([]));
  }, [fetchMethods, fetchCart]);

  useEffect(() => {
    if (!profile) return;
    setProfileForm({
      user_fname: profile.user_fname ?? '',
      user_lname: profile.user_lname ?? '',
      username: profile.username ?? '',
      user_email: profile.user_email ?? '',
      user_phone: profile.user_phone ?? '',
    });

    setNewAddress((prev) => ({
      ...prev,
      user_email: profile.user_email ?? '',
      user_contact: profile.user_phone ?? '',
    }));

    setNotifications(
      profile.notification_preferences ?? {
        order_updates: true,
        marketing_emails: false,
        price_drop_alerts: true,
      }
    );

    setPrivacy(
      profile.privacy_preferences ?? {
        analytics: true,
        marketing: false,
      }
    );
  }, [profile]);

  const stats = useMemo(() => {
    const pendingOrders = orders.filter((item) => item.status === 'pending' || item.status === 'confirmed').length;
    const wishlistCount = 14;
    const recentTotal = orders.slice(0, 3).reduce((sum, item) => sum + item.order_amount, 0);
    const savedMethods = methods.length;
    const activeCartItems = cart?.products?.length ?? 0;

    return {
      pendingOrders,
      wishlistCount,
      recentTotal,
      savedMethods,
      activeCartItems,
    };
  }, [orders, methods, cart]);

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    try {
      await save(profileForm);
      setMessage('Profile updated successfully.');
    } catch {
      // hook error handles state
    }
  };

  const handleAddAddress = async (event) => {
    event.preventDefault();
    try {
      await addAddress(newAddress);
      setMessage('Address added successfully.');
      setNewAddress({
        label: '',
        country: 'Kenya',
        county: 'Nairobi',
        city: '',
        line1: '',
        postal_address: '',
        user_email: profile?.user_email ?? '',
        user_contact: profile?.user_phone ?? '',
      });
    } catch {
      // hook error handles state
    }
  };

  const handleSaveNotifications = async () => {
    try {
      await saveNotifications(notifications);
      setMessage('Notification preferences saved.');
    } catch {
      // hook error handles state
    }
  };

  const handleSavePrivacy = async () => {
    try {
      await savePrivacy(privacy);
      setMessage('Privacy preferences saved.');
      setShowCookieModal(false);
    } catch {
      // hook error handles state
    }
  };

  const handleExportData = async () => {
    try {
      const result = await exportData();
      setMessage(result.message);
    } catch {
      // hook error handles state
    }
  };

  const sideItems = [
    'Dashboard',
    'My Orders',
    'Address Book',
    'Payment Methods',
    'Wishlist',
    'Recently Viewed',
    'Account Settings',
  ];

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-8 lg:px-6">
      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="w-full shrink-0 rounded-2xl border border-border bg-surface p-5 lg:w-72">
          <h2 className="text-lg font-bold text-foreground">Account Menu</h2>
          <p className="mt-1 text-xs text-muted">Manage your profile</p>
          <nav className="mt-6 space-y-1">
            {sideItems.map((item) => (
              <button
                key={item}
                type="button"
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  (item === 'Dashboard' && activeTab === 'dashboard') ||
                  (item === 'Address Book' && activeTab === 'addresses') ||
                  (item === 'Account Settings' && ['profile', 'notifications', 'privacy'].includes(activeTab))
                    ? 'bg-primary-100 font-semibold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                    : 'text-muted hover:bg-slate-100 hover:text-foreground dark:hover:bg-slate-900'
                }`}
                onClick={() => {
                  if (item === 'Dashboard') setActiveTab('dashboard');
                  if (item === 'Address Book') setActiveTab('addresses');
                  if (item === 'Account Settings') setActiveTab('profile');
                  if (item === 'My Orders') window.location.href = ROUTES.ORDERS;
                  if (item === 'Payment Methods') window.location.href = ROUTES.CHECKOUT;
                }}
              >
                {item}
              </button>
            ))}
          </nav>

          <button
            type="button"
            onClick={logout}
            className="mt-8 w-full rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-left text-sm font-semibold text-destructive hover:bg-destructive/10"
          >
            Log Out
          </button>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="mb-8 border-b border-border pb-5">
            <h1 className="text-4xl font-black tracking-tight text-foreground">Account Center</h1>
            <p className="mt-2 text-sm text-muted">Manage profile, preferences, addresses, and privacy controls.</p>
            <div className="mt-5 flex flex-wrap gap-5">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`pb-2 text-sm font-medium ${
                    activeTab === tab.key
                      ? 'border-b-2 border-primary-600 font-bold text-primary-600'
                      : 'text-muted hover:text-foreground'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </header>

          {activeTab === 'dashboard' ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                <article className="rounded-xl border border-border bg-surface p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Recent Orders</p>
                  <p className="mt-3 text-3xl font-black text-foreground">{stats.pendingOrders}</p>
                  <p className="mt-1 text-xs text-muted">Pending / Processing</p>
                </article>
                <article className="rounded-xl border border-border bg-surface p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Wishlist</p>
                  <p className="mt-3 text-3xl font-black text-foreground">{stats.wishlistCount}</p>
                  <p className="mt-1 text-xs text-muted">Saved items</p>
                </article>
                <article className="rounded-xl border border-border bg-surface p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Saved Cards</p>
                  <p className="mt-3 text-3xl font-black text-foreground">{stats.savedMethods}</p>
                  <p className="mt-1 text-xs text-muted">Payment methods</p>
                </article>
                <article className="rounded-xl border border-border bg-surface p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Cart Snapshot</p>
                  <p className="mt-3 text-3xl font-black text-foreground">{stats.activeCartItems}</p>
                  <p className="mt-1 text-xs text-muted">Items in cart</p>
                </article>
              </div>

              <div className="rounded-2xl border border-border bg-surface p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-black tracking-tight text-foreground">Recent Orders</h2>
                  <Link to={ROUTES.ORDERS} className="text-sm font-semibold text-primary-600 hover:underline">View All Orders</Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[680px] text-left">
                    <thead>
                      <tr className="text-xs uppercase tracking-[0.18em] text-muted">
                        <th className="py-3">Order</th>
                        <th className="py-3">Date</th>
                        <th className="py-3">Status</th>
                        <th className="py-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 4).map((order) => (
                        <tr key={order.id} className="border-t border-border text-sm">
                          <td className="py-3 font-semibold text-foreground">#{order.id}</td>
                          <td className="py-3 text-muted">{new Date(order.order_date).toLocaleDateString()}</td>
                          <td className="py-3 capitalize text-foreground">{order.status === 'confirmed' ? 'processing' : order.status}</td>
                          <td className="py-3 text-right font-bold text-primary-600">{formatCurrency(order.order_amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === 'profile' ? (
            <form onSubmit={handleSaveProfile} className="space-y-6 rounded-2xl border border-border bg-surface p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-muted">First Name</label>
                  <input
                    value={profileForm.user_fname}
                    onChange={(event) => setProfileForm((prev) => ({ ...prev, user_fname: event.target.value }))}
                    className="w-full rounded-lg border border-border bg-slate-50 px-3 py-2 text-sm text-foreground focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-muted">Last Name</label>
                  <input
                    value={profileForm.user_lname}
                    onChange={(event) => setProfileForm((prev) => ({ ...prev, user_lname: event.target.value }))}
                    className="w-full rounded-lg border border-border bg-slate-50 px-3 py-2 text-sm text-foreground focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:bg-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-muted">Username</label>
                <input
                  value={profileForm.username}
                  onChange={(event) => setProfileForm((prev) => ({ ...prev, username: event.target.value }))}
                  className="w-full rounded-lg border border-border bg-slate-50 px-3 py-2 text-sm text-foreground focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:bg-slate-900"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-muted">Email</label>
                  <input
                    type="email"
                    value={profileForm.user_email}
                    onChange={(event) => setProfileForm((prev) => ({ ...prev, user_email: event.target.value }))}
                    className="w-full rounded-lg border border-border bg-slate-50 px-3 py-2 text-sm text-foreground focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-muted">Phone</label>
                  <input
                    value={profileForm.user_phone}
                    onChange={(event) => setProfileForm((prev) => ({ ...prev, user_phone: event.target.value }))}
                    className="w-full rounded-lg border border-border bg-slate-50 px-3 py-2 text-sm text-foreground focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:bg-slate-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-primary-700 disabled:opacity-60"
              >
                Save Changes
              </button>
            </form>
          ) : null}

          {activeTab === 'notifications' ? (
            <section className="space-y-4 rounded-2xl border border-border bg-surface p-6">
              {[
                ['order_updates', 'Order Updates', 'Shipping and delivery confirmations.'],
                ['marketing_emails', 'Marketing Emails', 'Exclusive promotions and flash sales.'],
                ['price_drop_alerts', 'Price Drop Alerts', 'Wishlist and product discount alerts.'],
              ].map(([key, title, desc]) => (
                <div key={key} className="flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-slate-900/40">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{title}</h3>
                    <p className="text-xs text-muted">{desc}</p>
                  </div>
                  <label className="inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={Boolean(notifications[key])}
                      onChange={(event) =>
                        setNotifications((prev) => ({
                          ...prev,
                          [key]: event.target.checked,
                        }))
                      }
                      className="h-4 w-4 rounded border-border text-primary-600"
                    />
                  </label>
                </div>
              ))}

              <button
                type="button"
                onClick={handleSaveNotifications}
                disabled={loading}
                className="rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-primary-700 disabled:opacity-60"
              >
                Save Preferences
              </button>
            </section>
          ) : null}

          {activeTab === 'privacy' ? (
            <section className="space-y-6 rounded-2xl border border-border bg-surface p-6">
              <div>
                <h2 className="text-xl font-black tracking-tight text-foreground">Account Data & Privacy</h2>
                <p className="mt-2 text-sm text-muted">Control your export, tracking, and legal preferences.</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900/40">
                <h3 className="text-sm font-bold text-foreground">Download Your Data</h3>
                <p className="mt-1 text-xs text-muted">Request a secure archive of personal account activity and orders.</p>
                <button
                  type="button"
                  onClick={handleExportData}
                  disabled={loading}
                  className="mt-3 rounded-lg border border-primary-600 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-primary-600 hover:bg-primary-50 disabled:opacity-60 dark:hover:bg-primary-900/20"
                >
                  Request Data Export
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-slate-900/40">
                  <span className="text-sm font-semibold text-foreground">Analytics Cookies</span>
                  <input
                    type="checkbox"
                    checked={privacy.analytics}
                    onChange={(event) => setPrivacy((prev) => ({ ...prev, analytics: event.target.checked }))}
                    className="h-4 w-4 rounded border-border text-primary-600"
                  />
                </label>
                <label className="flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-slate-900/40">
                  <span className="text-sm font-semibold text-foreground">Marketing Cookies</span>
                  <input
                    type="checkbox"
                    checked={privacy.marketing}
                    onChange={(event) => setPrivacy((prev) => ({ ...prev, marketing: event.target.checked }))}
                    className="h-4 w-4 rounded border-border text-primary-600"
                  />
                </label>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleSavePrivacy}
                  disabled={loading}
                  className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-700 disabled:opacity-60"
                >
                  Save Privacy Settings
                </button>
                <button
                  type="button"
                  onClick={() => setShowCookieModal(true)}
                  className="rounded-lg border border-border bg-slate-100 px-5 py-2.5 text-sm font-bold text-foreground hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800"
                >
                  Open Cookie Modal
                </button>
              </div>

              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
                <h3 className="text-sm font-bold text-destructive">Delete Account</h3>
                <p className="mt-1 text-xs text-muted">Permanent action. Contact support for account deletion requests.</p>
              </div>
            </section>
          ) : null}

          {activeTab === 'addresses' ? (
            <section className="space-y-6 rounded-2xl border border-border bg-surface p-6">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="text-xl font-black tracking-tight text-foreground">Address Book</h2>
                  <p className="mt-1 text-sm text-muted">Manage shipping and billing destinations.</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {(profile?.addresses ?? []).map((address) => (
                  <article key={address.id} className="rounded-xl border border-border bg-slate-50 p-4 dark:bg-slate-900/40">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-sm font-bold text-foreground">{address.label ?? 'Address'}</h3>
                      {address.is_default ? (
                        <span className="rounded-full bg-primary-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                          Default
                        </span>
                      ) : null}
                    </div>
                    <p className="text-sm text-foreground">{address.line1 ?? ''}</p>
                    <p className="text-sm text-muted">{address.city}, {address.county}</p>
                    <p className="text-sm text-muted">{address.postal_address}</p>
                    <p className="mt-2 text-xs text-muted">{address.user_contact}</p>

                    <div className="mt-4 flex items-center gap-3">
                      {!address.is_default ? (
                        <button
                          type="button"
                          onClick={() => setDefaultAddress(address.id)}
                          className="text-xs font-semibold text-primary-600 hover:underline"
                        >
                          Set as default
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => removeAddress(address.id)}
                        className="text-xs font-semibold text-destructive hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              <form onSubmit={handleAddAddress} className="rounded-xl border border-border bg-slate-50 p-4 dark:bg-slate-900/40">
                <h3 className="mb-4 text-sm font-bold text-foreground">Add New Address</h3>
                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    value={newAddress.label}
                    onChange={(event) => setNewAddress((prev) => ({ ...prev, label: event.target.value }))}
                    placeholder="Label (Home, Office...)"
                    required
                    className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  />
                  <input
                    value={newAddress.county}
                    onChange={(event) => setNewAddress((prev) => ({ ...prev, county: event.target.value }))}
                    placeholder="County"
                    required
                    className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  />
                  <input
                    value={newAddress.city}
                    onChange={(event) => setNewAddress((prev) => ({ ...prev, city: event.target.value }))}
                    placeholder="City"
                    required
                    className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  />
                  <input
                    value={newAddress.line1}
                    onChange={(event) => setNewAddress((prev) => ({ ...prev, line1: event.target.value }))}
                    placeholder="Street Address"
                    required
                    className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  />
                  <input
                    value={newAddress.postal_address}
                    onChange={(event) => setNewAddress((prev) => ({ ...prev, postal_address: event.target.value }))}
                    placeholder="Postal Address"
                    required
                    className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  />
                  <input
                    value={newAddress.user_contact}
                    onChange={(event) => setNewAddress((prev) => ({ ...prev, user_contact: event.target.value }))}
                    placeholder="Phone"
                    required
                    className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-700 disabled:opacity-60"
                >
                  Add Address
                </button>
              </form>
            </section>
          ) : null}

          {error ? <p className="mt-5 text-sm font-medium text-destructive">{error}</p> : null}
          {message ? <p className="mt-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">{message}</p> : null}
        </section>
      </div>

      {showCookieModal ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <section className="w-full max-w-2xl rounded-2xl border border-border bg-surface shadow-2xl">
            <header className="flex items-start justify-between border-b border-border px-6 py-5">
              <div>
                <h3 className="text-2xl font-black tracking-tight text-foreground">Cookie Preferences</h3>
                <p className="mt-1 text-sm text-muted">Control analytics and marketing trackers.</p>
              </div>
              <button type="button" onClick={() => setShowCookieModal(false)} className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-900">
                ✕
              </button>
            </header>

            <div className="space-y-4 px-6 py-5">
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-slate-900/40">
                <div>
                  <h4 className="text-sm font-bold text-foreground">Strictly Necessary</h4>
                  <p className="text-xs text-muted">Required for app functionality.</p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">Locked</span>
              </div>

              <label className="flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-slate-900/40">
                <div>
                  <h4 className="text-sm font-bold text-foreground">Analytics</h4>
                  <p className="text-xs text-muted">Performance and behavior insights.</p>
                </div>
                <input
                  type="checkbox"
                  checked={privacy.analytics}
                  onChange={(event) => setPrivacy((prev) => ({ ...prev, analytics: event.target.checked }))}
                  className="h-4 w-4 rounded border-border text-primary-600"
                />
              </label>

              <label className="flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-slate-900/40">
                <div>
                  <h4 className="text-sm font-bold text-foreground">Marketing</h4>
                  <p className="text-xs text-muted">Ad personalization preferences.</p>
                </div>
                <input
                  type="checkbox"
                  checked={privacy.marketing}
                  onChange={(event) => setPrivacy((prev) => ({ ...prev, marketing: event.target.checked }))}
                  className="h-4 w-4 rounded border-border text-primary-600"
                />
              </label>
            </div>

            <footer className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
              <button
                type="button"
                onClick={() => {
                  setPrivacy({ analytics: false, marketing: false });
                  setShowCookieModal(false);
                }}
                className="rounded-lg border border-border bg-slate-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-foreground dark:bg-slate-900"
              >
                Reject All
              </button>
              <button
                type="button"
                onClick={handleSavePrivacy}
                className="rounded-lg bg-primary-600 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-white"
              >
                Save Preferences
              </button>
              <button
                type="button"
                onClick={() => {
                  setPrivacy({ analytics: true, marketing: true });
                  setShowCookieModal(false);
                }}
                className="rounded-lg bg-gradient-to-br from-primary-700 to-primary-500 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-white"
              >
                Accept All
              </button>
            </footer>
          </section>
        </div>
      ) : null}
    </div>
  );
};

export default ProfilePage;
