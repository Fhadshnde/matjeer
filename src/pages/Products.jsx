import React, { useState, useEffect, useMemo } from 'react';
import AddProductModal from '../components/addModals/product';
import EditProductModal from '../components/editModals/product';
import DeleteProductModal from '../components/deleteModal/deleteProduct';

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchProduct, setSearchProduct] = useState("");
  const [statistics, setStatistics] = useState({
    products: {
      total: 0,
      lowStockProducts: 0,
      outOfStockProducts: 0,
    }
  });

  // جلب المنتجات مع pagination والبحث
  const fetchProducts = async () => {
    try {
      const response = await fetch(`https://products-api.cbc-apps.net/products?search=${searchProduct}&limit=10&page=${currentPage}`);
      const data = await response.json();

      if (data && data.pagination) {
        setProducts(data.products || []);
        setPagination(data.pagination);
        setStatistics(prev => ({
          ...prev,
          products: {
            total: data.pagination.total || 0,
            lowStockProducts: data.lowStockProducts || 0,
            outOfStockProducts: data.outOfStockProducts || 0,
          }
        }));
      } else {
        setProducts([]);
        setPagination(null);
        setStatistics({
          products: {
            total: 0,
            lowStockProducts: 0,
            outOfStockProducts: 0,
          }
        });
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // تحميل البيانات عند التغيير في البحث أو الصفحة
  useEffect(() => {
    fetchProducts();
  }, [searchProduct, currentPage]);

  // صفحات التصفح (pagination)
  const visiblePages = useMemo(() => {
    if (!pagination) return [];
    const total = pagination.totalPages;
    const current = currentPage;
    const pages = [];

    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    if (current <= 2) {
      pages.push(1, 2, 3, '...', total);
    } else if (current >= total - 1) {
      pages.push(1, '...', total - 2, total - 1, total);
    } else {
      pages.push(1, '...', current - 1, current, current + 1, '...', total);
    }
    return pages;
  }, [pagination, currentPage]);

  // إضافة منتج (تابع يفتح المودال)
  const handleAddProduct = async (newProductData) => {
    try {
      await fetch("https://products-api.cbc-apps.net/products", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProductData),
      });
      setCurrentPage(1);
      fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  // حذف منتج
  const handleDeleteProduct = async (id) => {
    try {
      await fetch(`https://products-api.cbc-apps.net/products/${id}`, {
        method: 'DELETE',
      });
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // تعديل منتج (يربط مع مودال التعديل)
  const handleEditSuccess = () => {
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      {/* Header */}
      <div className="bg-[#1A1A1A]/80 border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Products Management</h1>
          <AddProductModal onSubmit={handleAddProduct} />
        </div>
      </div>

      {/* Stats Overview */}
      <div dir="rtl" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-3 pt-3 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-mini bg-[#1A1A1A] border border-white/5 rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-[#94A3B8] text-sm">مجموع المنتجات</p>
            <p className="text-2xl font-bold text-white">{statistics.products.total}</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-[#5E54F2]/20 to-[#7C3AED]/20 rounded-lg flex items-center justify-center">
            {/* أيقونة */}
            <svg className="w-6 h-6 text-[#5E54F2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
          </div>
        </div>

        <div className="stat-mini bg-[#1A1A1A] border border-white/5 rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-[#94A3B8] text-sm">منتجات قليلة</p>
            <p className="text-2xl font-bold text-[#F97316]">{statistics.products.lowStockProducts}</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-[#F97316]/20 to-[#EA580C]/20 rounded-lg flex items-center justify-center">
            {/* أيقونة */}
            <svg className="w-6 h-6 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
        </div>

        <div className="stat-mini bg-[#1A1A1A] border border-white/5 rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-[#94A3B8] text-sm">منتجات نفذت</p>
            <p className="text-2xl font-bold text-red-500">{statistics.products.outOfStockProducts}</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-lg flex items-center justify-center">
            {/* أيقونة */}
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 pt-3">
        <div className="bg-[#1A1A1A] rounded-xl border border-white/5 p-4">
          <div className="relative md:grid md:grid-cols-4 gap-4">
            <input
              type="text"
              value={searchProduct}
              onChange={(e) => setSearchProduct(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 bg-[#0F0F0F] border border-white/10 rounded-lg text-white placeholder-[#94A3B8] focus:border-[#5E54F2] focus:outline-none"
            />
            <svg className="absolute left-3 top-2.5 w-5 h-5 text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product.id} className="product-card relative bg-[#1A1A1A] rounded-xl border border-white/5 overflow-hidden hover:border-[#5E54F2]/50 transition-all duration-300 ease-in-out">
            {/* Delete button */}
            <div className="absolute right-4 top-4 w-6 h-6 cursor-pointer hover:-translate-y-[2px] hover:scale-110 transition-transform duration-200 rounded-lg text-red-500">
              <DeleteProductModal id={product.id} onDelete={() => handleDeleteProduct(product.id)} />
            </div>
            {/* Edit button */}
            <div className="absolute left-4 top-4 w-6 h-6 cursor-pointer hover:-translate-y-[2px] hover:scale-110 transition-transform duration-200 rounded-lg text-gray-500">
              <EditProductModal productId={product.id} onEditSuccess={handleEditSuccess} />
            </div>

            <div className="aspect-w-1 aspect-h-1 bg-gradient-to-br from-[#5E54F2]/20 to-[#7C3AED]/20 p-1">
              <img className="w-full object-cover h-60 rounded-md" src={product.mainImageUrl} alt={product.name} />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-white mb-1">{product.name}</h3>
              <p className="text-sm text-[#94A3B8] mb-3">{product.category.name}</p>
              <div className="flex items-center -space-x-4 my-1">
                {product.colors.map((color, i) => (
                  <div
                    key={i}
                    style={{ backgroundColor: color.code }}
                    className="w-8 h-8 rounded-full border-2 border-[#1A1A1A] hover:scale-110 hover:z-10 transition-all cursor-pointer"
                    title={color.name}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between mb-3 my-3">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-white">{product.price}</span>
                    <span className="text-sm text-[#94A3B8]">IQD</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-[#94A3B8] line-through">{product.originalPrice} IQD</span>
                    <span className="px-2 py-0.5 text-xs font-semibold text-white bg-gradient-to-r from-[#F97316] to-[#EA580C] rounded-md">
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </span>
                  </div>
                </div>
                <span className="px-2 py-1 text-xs font-semibold text-white bg-[#10B981] rounded-full">In Stock</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></div>
                  <span className="text-sm text-[#10B981] font-medium">In Stock</span>
                </div>
                <span className="text-xs text-[#94A3B8]"><span className="font-bold">{product.stock}</span> منتجات متبقية</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-between">
        {pagination && (
          <p className="text-sm text-[#94A3B8]">
            Showing <span className="font-medium text-white">{pagination.from}-{pagination.to}</span> of <span className="font-medium text-white">{pagination.total}</span> products
          </p>
        )}

        <div className="flex items-center gap-2">
          <button
            className="pagination-btn px-3 py-2 text-[#94A3B8] hover:text-white hover:bg-white/5 rounded-lg transition-all disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>

          {visiblePages.map((page, i) =>
            page === '...' ? (
              <button key={i} disabled className="pagination-btn px-3 py-2 text-[#94A3B8] cursor-default">
                ...
              </button>
            ) : (
              <button
                key={i}
                onClick={() => setCurrentPage(page)}
                className={
                  page === currentPage
                    ? "pagination-btn px-3 py-2 bg-[#5E54F2] text-white rounded-lg"
                    : "pagination-btn px-3 py-2 text-[#94A3B8] hover:text-white hover:bg-white/5 rounded-lg transition-all"
                }
              >
                {page}
              </button>
            )
          )}

          <button
            className="pagination-btn px-3 py-2 text-[#94A3B8] hover:text-white hover:bg-white/5 rounded-lg transition-all disabled:opacity-50"
            disabled={pagination && currentPage === pagination.totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pagination.totalPages))}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductsManagement;
