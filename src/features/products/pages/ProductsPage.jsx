import { useState } from 'react';
import { useProductsHook } from '../hooks/useProductsHook';
import ProductList from '../components/ProductList';

const ProductsPage = () => {
  const [search, setSearch] = useState('');
  const { products, loading, error, refetch } = useProductsHook();

  const handleSearch = (e) => {
    e.preventDefault();
    refetch({ search });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-foreground">Shop</h1>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="rounded-lg border border-border bg-surface px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            type="submit"
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            Search
          </button>
        </form>
      </div>

      <ProductList products={products} loading={loading} error={error} />
    </div>
  );
};

export default ProductsPage;
