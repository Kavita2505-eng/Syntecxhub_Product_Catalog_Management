import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { productService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Save, ArrowLeft, AlertCircle } from 'lucide-react';
import { DetailsSkeleton } from '../components/Skeletons';

export default function EditProduct() {
  const { id } = useParams();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  // Form Field States
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [stock, setStock] = useState('');

  // UI States
  const [existingCategories, setExistingCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch product data and categories list on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [prodResponse, statsResponse] = await Promise.all([
          productService.getProductById(id),
          productService.getProductStats(),
        ]);

        if (prodResponse.success && prodResponse.product) {
          const prod = prodResponse.product;
          setName(prod.name);
          setSku(prod.sku);
          setDescription(prod.description || '');
          setPrice(prod.price.toString());
          setCategory(prod.category);
          setStock(prod.stock.toString());
        } else {
          showError('Product not found');
          navigate('/products');
          return;
        }

        if (statsResponse.success && statsResponse.data?.categoryDistribution) {
          const cats = statsResponse.data.categoryDistribution.map((c) => c.category);
          setExistingCategories(cats);
        }
      } catch (err) {
        showError(err.message || 'Failed to load product details');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, navigate, showError]);

  const validateForm = () => {
    const tempErrors = {};
    if (!name.trim()) {
      tempErrors.name = 'Product name is required';
    } else if (name.trim().length > 100) {
      tempErrors.name = 'Name cannot exceed 100 characters';
    }

    if (!sku.trim()) {
      tempErrors.sku = 'Product SKU code is required';
    } else if (!/^[a-zA-Z0-9-]+$/.test(sku.trim())) {
      tempErrors.sku = 'SKU must be alphanumeric and can only contain hyphens (-)';
    } else if (sku.trim().length < 3 || sku.trim().length > 30) {
      tempErrors.sku = 'SKU must be between 3 and 30 characters';
    }

    const categoryValue = isCustomCategory ? customCategory : category;
    if (!categoryValue || !categoryValue.trim()) {
      tempErrors.category = 'Category is required';
    }

    if (price === '' || price === undefined) {
      tempErrors.price = 'Price is required';
    } else {
      const priceNum = parseFloat(price);
      if (isNaN(priceNum) || priceNum < 0) {
        tempErrors.price = 'Price must be a positive number';
      }
    }

    if (stock === '' || stock === undefined) {
      tempErrors.stock = 'Stock count is required';
    } else {
      const stockNum = Number(stock);
      if (!Number.isInteger(stockNum) || stockNum < 0) {
        tempErrors.stock = 'Stock must be a positive integer';
      }
    }

    if (description.trim().length > 500) {
      tempErrors.description = 'Description cannot exceed 500 characters';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showError('Please check form validations');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        sku: sku.trim().toUpperCase(),
        description: description.trim(),
        price: parseFloat(price),
        category: (isCustomCategory ? customCategory : category).trim(),
        stock: parseInt(stock, 10),
      };

      const response = await productService.updateProduct(id, payload);
      if (response.success) {
        showSuccess('Product updated successfully!');
        navigate('/products');
      }
    } catch (err) {
      showError(err.message || 'Failed to update product');
      if (err.message && err.message.toLowerCase().includes('sku')) {
        setErrors((prev) => ({ ...prev, sku: 'This SKU is already registered in the system' }));
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <DetailsSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Top Navigation */}
      <div className="flex items-center gap-3">
        <Link
          to="/products"
          className="p-1.5 border border-slate-200 hover:bg-slate-50 text-slate-650 rounded-lg transition-colors bg-white shadow-subtle text-slate-700"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Edit Product</h1>
          <p className="text-xs text-slate-500">Modify product item parameters.</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200/80 shadow-subtle">
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Product Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">
              Product Name *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
              className={`mt-1.5 block w-full px-3 py-2 border rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all text-sm ${
                errors.name ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:border-brand-500'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.name}
              </p>
            )}
          </div>

          {/* SKU & Category Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SKU */}
            <div>
              <label htmlFor="sku" className="block text-sm font-medium text-slate-700">
                SKU Code *
              </label>
              <input
                type="text"
                id="sku"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                disabled={submitting}
                className={`mt-1.5 block w-full px-3 py-2 border rounded-lg text-slate-850 font-mono text-xs uppercase focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all ${
                  errors.sku ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:border-brand-500'
                }`}
              />
              {errors.sku && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.sku}
                </p>
              )}
            </div>

            {/* Category selection */}
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="category" className="block text-sm font-medium text-slate-700">
                  Category *
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomCategory(!isCustomCategory);
                    if (!isCustomCategory) {
                      setCustomCategory(category);
                    }
                  }}
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
                >
                  {isCustomCategory ? 'Select Existing' : 'Create Custom'}
                </button>
              </div>

              {isCustomCategory ? (
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  disabled={submitting}
                  className={`mt-1.5 block w-full px-3 py-2 border rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all text-sm ${
                    errors.category ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:border-brand-500'
                  }`}
                />
              ) : (
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={submitting}
                  className={`mt-1.5 block w-full px-3 py-2 border rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all text-sm bg-white ${
                    errors.category ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:border-brand-500'
                  }`}
                >
                  <option value="">Select category</option>
                  {existingCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              )}

              {errors.category && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.category}
                </p>
              )}
            </div>
          </div>

          {/* Pricing & Stock levels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-slate-700">
                Price ($) *
              </label>
              <input
                type="number"
                step="0.01"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={submitting}
                className={`mt-1.5 block w-full px-3 py-2 border rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all text-sm ${
                  errors.price ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:border-brand-500'
                }`}
              />
              {errors.price && (
                <p className="mt-1 text-xs text-rose-650 text-rose-600 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.price}
                </p>
              )}
            </div>

            {/* Stock Quantity */}
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-slate-700">
                Stock Quantity *
              </label>
              <input
                type="number"
                id="stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                disabled={submitting}
                className={`mt-1.5 block w-full px-3 py-2 border rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all text-sm ${
                  errors.stock ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:border-brand-500'
                }`}
              />
              {errors.stock && (
                <p className="mt-1 text-xs text-rose-650 text-rose-600 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.stock}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              id="description"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitting}
              className={`mt-1.5 block w-full px-3 py-2 border rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all text-sm ${
                errors.description ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:border-brand-500'
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Action Bar */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              to="/products"
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-650 rounded-lg text-sm font-medium transition-colors bg-white text-slate-700"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-60"
            >
              {submitting ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
