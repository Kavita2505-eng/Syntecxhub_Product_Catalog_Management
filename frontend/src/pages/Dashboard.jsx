import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { DashboardStatsSkeleton } from '../components/Skeletons';
import {
  Boxes,
  Layers,
  CircleDollarSign,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  PackageCheck
} from 'lucide-react';

export default function Dashboard() {
  const { showError } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    averagePrice: 0,
    highestPrice: 0,
    lowestPrice: 0,
    totalInventoryValue: 0,
    totalStock: 0,
    lowStockCount: 0,
    categoryDistribution: []
  });
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loadingLowStock, setLoadingLowStock] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const response = await productService.getProductStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err.message);
      showError('Failed to fetch dashboard metrics');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const fetchLowStockProducts = useCallback(async () => {
    try {
      // Query low-stock status from backend with a small limit
      const response = await productService.getProducts({ stockStatus: 'low-stock', limit: 5 });
      if (response.success && response.products) {
        setLowStockProducts(response.products);
      }
    } catch (err) {
      console.error('Error fetching low stock:', err.message);
    } finally {
      setLoadingLowStock(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchLowStockProducts();
  }, [fetchStats, fetchLowStockProducts]);

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      desc: 'Unique products in catalog',
      icon: Boxes,
      color: 'bg-blue-50 text-blue-600 border-blue-100',
    },
    {
      title: 'Categories',
      value: stats.categoryDistribution.length,
      desc: 'Product departments',
      icon: Layers,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    {
      title: 'Inventory Value',
      value: `$${stats.totalInventoryValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      desc: 'Total stock asset value',
      icon: CircleDollarSign,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    },
    {
      title: 'Low Stock Products',
      value: stats.lowStockCount,
      desc: 'Stock level below 10 units',
      icon: AlertTriangle,
      color: stats.lowStockCount > 0 ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-50 text-slate-400 border-slate-100',
    },
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Generating catalog summaries...</p>
        </div>
        <DashboardStatsSkeleton />
      </div>
    );
  }

  const maxCategoryCount = Math.max(...stats.categoryDistribution.map((c) => c.count), 1);

  return (
    <div className="space-y-8">
      {/* Page Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Here is a quick overview of your product catalog assets.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/products/new"
            className="inline-flex items-center justify-center px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            Create Product
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center justify-center px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-sm font-medium transition-colors bg-white shadow-subtle"
          >
            Manage Catalog
          </Link>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-subtle flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{card.title}</span>
                <div className={`p-2 rounded-lg border ${card.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{card.value}</h3>
                <p className="text-xs text-slate-500 mt-1.5">{card.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown (2 columns wide on desktop) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-subtle lg:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-brand-600" />
            <h2 className="text-base font-semibold text-slate-900">Category Distribution</h2>
          </div>

          {stats.categoryDistribution.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              <PackageCheck className="h-10 w-10 mx-auto text-slate-200 mb-3" />
              <span>No categories listed in the catalog yet.</span>
            </div>
          ) : (
            <div className="space-y-5">
              {stats.categoryDistribution.map((cat) => (
                <div key={cat.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-700">{cat.category}</span>
                    <span className="text-slate-500">
                      {cat.count} {cat.count === 1 ? 'product' : 'products'} • ${cat.inventoryValue.toLocaleString(undefined, { minimumFractionDigits: 2 })} Value
                    </span>
                  </div>
                  <div className="relative w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-brand-500 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${(cat.count / maxCategoryCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Alerts (1 column wide) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <h2 className="text-base font-semibold text-slate-900">Low Stock Alerts</h2>
            </div>
            {stats.lowStockCount > 5 && (
              <Link to="/products?stockStatus=low-stock" className="text-xs font-medium text-brand-600 hover:text-brand-700 flex items-center gap-0.5">
                View all ({stats.lowStockCount})
                <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </div>

          {loadingLowStock ? (
            <div className="space-y-3">
              <div className="h-10 bg-slate-100 rounded w-full animate-pulse"></div>
              <div className="h-10 bg-slate-100 rounded w-full animate-pulse"></div>
              <div className="h-10 bg-slate-100 rounded w-full animate-pulse"></div>
            </div>
          ) : lowStockProducts.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-center text-slate-400 text-sm">
              <PackageCheck className="h-8 w-8 text-emerald-400 mb-2" />
              <span className="font-medium text-slate-700">Perfect Stock Health</span>
              <span className="text-xs text-slate-400 mt-1">All products have 10+ units.</span>
            </div>
          ) : (
            <div className="divide-y divide-slate-150">
              {lowStockProducts.map((prod) => (
                <div key={prod._id} className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0">
                  <div className="min-w-0 pr-3">
                    <Link to={`/products/${prod._id}`} className="text-sm font-medium text-slate-800 hover:text-brand-600 truncate block">
                      {prod.name}
                    </Link>
                    <span className="text-xs text-slate-400 block mt-0.5">SKU: {prod.sku} • {prod.category}</span>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold leading-4 ${
                      prod.stock === 0
                        ? 'bg-rose-50 text-rose-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {prod.stock === 0 ? 'Out of Stock' : `${prod.stock} left`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
