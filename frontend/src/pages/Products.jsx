import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/api';
import { useToast } from '../context/ToastContext';
import useDebounce from '../hooks/useDebounce';
import { TableSkeleton } from '../components/Skeletons';
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit2,
  Trash2,
  Plus,
  Package,
  X,
  AlertTriangle
} from 'lucide-react';

export default function Products() {
  const { showSuccess, showError } = useToast();

  // Search, Filter, Sort and Paginate state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);

  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]); // Dynamic category list
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [stockStatus, setStockStatus] = useState('');

  // Sorting
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Deletion Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch unique categories dynamically from Stats endpoint
  const fetchCategories = useCallback(async () => {
    try {
      const response = await productService.getProductStats();
      if (response.success && response.data?.categoryDistribution) {
        const uniqueCats = response.data.categoryDistribution.map((c) => c.category);
        setCategories(uniqueCats);
      }
    } catch (err) {
      console.error('Error fetching categories:', err.message);
    }
  }, []);

  // Main fetch function
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit,
        search: debouncedSearch,
        category,
        minPrice,
        maxPrice,
        stockStatus,
        sortBy,
        sortOrder,
      };

      const response = await productService.getProducts(params);
      if (response.success) {
        setProducts(response.products || []);
        setTotalCount(response.totalCount || 0);
        setTotalPages(response.totalPages || 1);
      }
    } catch (err) {
      showError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit, debouncedSearch, category, minPrice, maxPrice, stockStatus, sortBy, sortOrder, showError]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Reset pagination on filter adjustments
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, category, minPrice, maxPrice, stockStatus, sortBy, sortOrder]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setStockStatus('');
    setSortBy('createdAt');
    setSortOrder('desc');
    setCurrentPage(1);
    showSuccess('Filters reset successfully');
  };

  // Delete Action Trigger
  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedProduct(null);
    setDeleteModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;
    setDeleting(true);
    try {
      const response = await productService.deleteProduct(selectedProduct._id);
      if (response.success) {
        showSuccess(`Product "${selectedProduct.name}" deleted successfully.`);
        closeDeleteModal();
        // If it was the last product on the page, roll back page number
        if (products.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          fetchProducts();
        }
        fetchCategories(); // Update dynamic categories list
      }
    } catch (err) {
      showError(err.message || 'Failed to delete product');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Products Catalog</h1>
          <p className="text-sm text-slate-500 mt-1">Browse, filter, and manage your inventory items.</p>
        </div>
        <Link
          to="/products/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      {/* Filters Card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-subtle space-y-4">
        {/* Search and Quick Filters */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-5 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="h-4.5 w-4.5" />
            </div>
            <input
              type="text"
              placeholder="Search products by name, SKU, description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm bg-slate-50/50"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm bg-slate-50/50"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              value={stockStatus}
              onChange={(e) => setStockStatus(e.target.value)}
              className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm bg-slate-50/50"
            >
              <option value="">All Stock Status</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock (&lt; 10)</option>
              <option value="out-of-stock">Out of Stock (0)</option>
            </select>
          </div>

          <div className="md:col-span-2 flex items-center justify-end">
            <button
              onClick={handleResetFilters}
              className="w-full inline-flex items-center justify-center px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-sm font-medium transition-colors bg-white shadow-subtle"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Pricing Range Filters */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <span className="font-medium text-slate-700">Price Range:</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min ($)"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-24 px-2.5 py-1 border border-slate-200 rounded-md text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-xs bg-slate-50/50"
            />
            <span className="text-slate-400">to</span>
            <input
              type="number"
              placeholder="Max ($)"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-24 px-2.5 py-1 border border-slate-200 rounded-md text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-xs bg-slate-50/50"
            />
          </div>
        </div>
      </div>

      {/* Main Table Content */}
      {loading ? (
        <TableSkeleton rows={6} />
      ) : products.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl shadow-subtle p-12 text-center">
          <div className="inline-flex p-3 rounded-full bg-slate-50 text-slate-400 mb-4 border border-slate-100 shadow-sm">
            <Package className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">No products found</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria, price range filters, or category dropdowns.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-sm font-medium transition-colors bg-white shadow-subtle"
            >
              Clear Filters
            </button>
            <Link
              to="/products/new"
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              Add New Product
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('name')} className="cursor-pointer hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-1">
                      Product Name
                      <ArrowUpDown className="h-3 w-3 text-slate-400" />
                    </div>
                  </th>
                  <th onClick={() => handleSort('sku')} className="cursor-pointer hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-1">
                      SKU
                      <ArrowUpDown className="h-3 w-3 text-slate-400" />
                    </div>
                  </th>
                  <th>Category</th>
                  <th onClick={() => handleSort('price')} className="cursor-pointer hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-1">
                      Price
                      <ArrowUpDown className="h-3 w-3 text-slate-400" />
                    </div>
                  </th>
                  <th onClick={() => handleSort('stock')} className="cursor-pointer hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-1">
                      Stock
                      <ArrowUpDown className="h-3 w-3 text-slate-400" />
                    </div>
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {products.map((prod) => (
                  <tr key={prod._id} className="hover:bg-slate-50/60 transition-colors">
                    <td>
                      <div className="font-medium text-slate-900">{prod.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">{prod.description || 'No description provided'}</div>
                    </td>
                    <td className="font-mono text-xs font-semibold text-slate-500">{prod.sku}</td>
                    <td>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        {prod.category}
                      </span>
                    </td>
                    <td className="font-medium text-slate-900">${prod.price.toFixed(2)}</td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold leading-4 ${
                          prod.stock === 0
                            ? 'bg-rose-50 text-rose-700'
                            : prod.stock < 10
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          {prod.stock === 0 ? 'Out of Stock' : `${prod.stock} units`}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/products/${prod._id}`}
                          className="p-1.5 text-slate-450 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
                          title="View Details"
                        >
                          <Eye className="h-4.5 w-4.5" />
                        </Link>
                        <Link
                          to={`/products/${prod._id}/edit`}
                          className="p-1.5 text-slate-450 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors text-slate-500"
                          title="Edit Product"
                        >
                          <Edit2 className="h-4.5 w-4.5" />
                        </Link>
                        <button
                          onClick={() => openDeleteModal(prod)}
                          className="p-1.5 text-slate-450 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-slate-500"
                          title="Delete Product"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Toolbar */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border border-slate-200 rounded-lg shadow-subtle sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-slate-200 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-slate-200 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40"
              >
                Next
              </button>
            </div>

            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <div>
                  Showing <span className="font-semibold text-slate-800">{totalCount === 0 ? 0 : (currentPage - 1) * limit + 1}</span> to{' '}
                  <span className="font-semibold text-slate-800">
                    {Math.min(currentPage * limit, totalCount)}
                  </span>{' '}
                  of <span className="font-semibold text-slate-800">{totalCount}</span> results
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs">Show</span>
                  <select
                    value={limit}
                    onChange={(e) => {
                      setLimit(parseInt(e.target.value, 10));
                      setCurrentPage(1);
                    }}
                    className="px-1.5 py-0.5 border border-slate-250 border-slate-200 rounded text-xs text-slate-700 focus:outline-none focus:border-brand-500 bg-slate-50/50"
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                  </select>
                  <span className="text-xs">per page</span>
                </div>
              </div>

              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-200 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-40"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    // Render truncated pagination if there are too many pages
                    if (totalPages > 5 && Math.abs(pageNum - currentPage) > 2 && pageNum !== 1 && pageNum !== totalPages) {
                      if (pageNum === 2 || pageNum === totalPages - 1) {
                        return <span key={pageNum} className="relative inline-flex items-center px-3 py-2 border border-slate-200 bg-slate-50 text-sm font-medium text-slate-500">...</span>;
                      }
                      return null;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        aria-current={currentPage === pageNum ? 'page' : undefined}
                        className={`relative inline-flex items-center px-4.5 py-2 border text-sm font-medium ${
                          currentPage === pageNum
                            ? 'z-10 bg-brand-50 border-brand-500 text-brand-600 font-semibold'
                            : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-200 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-40"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal Overlay */}
      {deleteModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/40">
          <div className="bg-white rounded-xl border border-slate-250 shadow-2xl max-w-md w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center gap-3 text-rose-600 mb-4">
                <div className="p-2 rounded-full bg-rose-50 text-rose-600 border border-rose-100">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Delete Product</h3>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                Are you sure you want to delete <span className="font-semibold text-slate-800">"{selectedProduct.name}"</span>? 
                This action is permanent and will completely remove this product SKU <span className="font-mono text-xs bg-slate-100 px-1 rounded">{selectedProduct.sku}</span> from catalog inventory records.
              </p>
            </div>
            <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-150">
              <button
                onClick={closeDeleteModal}
                disabled={deleting}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-sm font-medium transition-colors bg-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="px-4 py-2 bg-rose-65 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-60 flex items-center gap-1.5"
              >
                {deleting ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Confirm Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
