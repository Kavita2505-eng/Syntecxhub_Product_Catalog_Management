import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { ArrowLeft, Edit2, Package, Tag, Calendar, User, ShoppingBag, Info } from 'lucide-react';
import { DetailsSkeleton } from '../components/Skeletons';

export default function ProductDetails() {
  const { id } = useParams();
  const { showError } = useToast();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await productService.getProductById(id);
        if (response.success && response.product) {
          setProduct(response.product);
        } else {
          showError('Product not found');
          navigate('/products');
        }
      } catch (err) {
        showError(err.message || 'Failed to retrieve product details');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id, navigate, showError]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <DetailsSkeleton />
      </div>
    );
  }

  if (!product) return null;

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/products"
            className="p-1.5 border border-slate-200 hover:bg-slate-50 text-slate-650 rounded-lg transition-colors bg-white shadow-subtle text-slate-700"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Product Details</h1>
            <p className="text-xs text-slate-500">View comprehensive item parameters.</p>
          </div>
        </div>

        <Link
          to={`/products/${product._id}/edit`}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Edit2 className="h-4 w-4" />
          Edit Product
        </Link>
      </div>

      {/* Main Details Sheet */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-subtle overflow-hidden">
        {/* Banner area */}
        <div className="bg-slate-50 px-6 py-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-600 bg-brand-50 border border-brand-100 px-2.5 py-1 rounded">
              {product.category}
            </span>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-3">{product.name}</h2>
            <div className="flex items-center gap-2 mt-1.5 font-mono text-xs font-semibold text-slate-400">
              <Package className="h-4 w-4 text-slate-400" />
              SKU: {product.sku}
            </div>
          </div>
          <div className="text-left md:text-right shrink-0">
            <span className="text-xs text-slate-400 block font-medium">Unit Price</span>
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">${product.price.toFixed(2)}</span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-slate-100 bg-slate-50/20">
          {/* Stock Level Card */}
          <div className="bg-white p-5 rounded-lg border border-slate-150 border-slate-200/60 shadow-subtle flex items-start gap-4">
            <div className={`p-2 rounded-lg border shrink-0 ${
              product.stock === 0
                ? 'bg-rose-50 border-rose-100 text-rose-500'
                : product.stock < 10
                ? 'bg-amber-50 border-amber-100 text-amber-500'
                : 'bg-emerald-50 border-emerald-100 text-emerald-500'
            }`}>
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Stock Level Status</span>
              <span className="text-lg font-bold text-slate-800 mt-1 block">
                {product.stock === 0 ? 'Out of Stock' : `${product.stock} Units Available`}
              </span>
              <span className="text-xs text-slate-400 mt-1 block">
                {product.stock === 0 
                  ? 'Reorder immediately.' 
                  : product.stock < 10 
                  ? 'Running low, plan reorder.' 
                  : 'Sufficient inventory buffer.'}
              </span>
            </div>
          </div>

          {/* Creation Metadata Card */}
          <div className="bg-white p-5 rounded-lg border border-slate-150 border-slate-200/60 shadow-subtle flex items-start gap-4">
            <div className="p-2 rounded-lg border border-slate-100 bg-slate-50 text-slate-500 shrink-0">
              <User className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Created By User</span>
              <span className="text-base font-bold text-slate-800 mt-1 block truncate max-w-[200px]">
                {product.createdBy?.username || 'Unknown Operator'}
              </span>
              <span className="text-xs text-slate-455 text-slate-455 text-slate-400 mt-0.5 block truncate max-w-[200px]">
                {product.createdBy?.email || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Text descriptions */}
        <div className="p-6 md:p-8 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5 mb-2">
              <Info className="h-4.5 w-4.5 text-slate-400" />
              Item Description
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-lg border border-slate-200/60 font-sans">
              {product.description || 'No description was provided for this catalog record.'}
            </p>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span>Record Created: {formatDate(product.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span>Last Modified: {formatDate(product.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
