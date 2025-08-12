import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
// Assuming these are your modal components
import AddSupplierModal from '../components/addModals/supplier';
import DeleteSupplierModal from '../components/deleteModal/deleteCategory';

const SuppliersManagement = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const navigate = useNavigate();

  // Middleware equivalent for auth
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const fetchSuppliers = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('https://products-api.cbc-apps.net/suppliers', {
        headers: {
          authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      setSuppliers(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // UseMemo for computed properties
  const filteredSuppliers = useMemo(() => {
    let filtered = suppliers;
  
    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(supplier =>
        supplier.category.toLowerCase() === activeCategory
      );
    }
  
    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(supplier =>
        supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (supplier.products && supplier.products.some(p => p.toLowerCase().includes(searchQuery.toLowerCase())))
      );
    }
  
    // Sort
    switch (sortBy) {
      case 'rating':
        return filtered.sort((a, b) => b.rating - a.rating);
      case 'orders':
        return filtered.sort((a, b) => b.orders - a.orders);
      case 'recent':
        return filtered.sort((a, b) => a.responseTime - b.responseTime);
      default:
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [suppliers, activeCategory, searchQuery, sortBy]);

  // Categories and product count are simple data structures, no need for useMemo
  const categories = [
    { id: 'all', name: 'All Suppliers' },
    { id: 'equipment', name: 'Equipment' },
    { id: 'materials', name: 'Materials' },
    { id: 'safety', name: 'Safety' },
    { id: 'tools', name: 'Tools' },
    { id: 'logistics', name: 'Logistics' }
  ];

  const productCount = (supplierId) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    return supplier?.products?.length || 0;
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      {/* Header */}
      <div className="bg-[#1A1A1A]/80 border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Suppliers Management</h1>
            </div>
            <div className="flex items-center gap-3">
              {/* Assuming AddSupplierModal is a component you have */}
              <AddSupplierModal onSubmit={fetchSuppliers} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                    activeCategory === category.id
                      ? 'bg-[#5E54F2] text-white'
                      : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
            
            {/* Search & Sort */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search suppliers..."
                  className="pl-10 pr-4 py-2 bg-[#0F0F0F] border border-white/10 rounded-lg text-white placeholder-[#94A3B8] focus:border-[#5E54F2] focus:outline-none w-64"
                />
                <svg className="absolute left-3 top-2.5 w-5 h-5 text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0118 0z"></path>
                </svg>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-[#0F0F0F] border border-white/10 rounded-lg text-white focus:border-[#5E54F2] focus:outline-none"
              >
                <option value="name">Name A-Z</option>
                <option value="rating">Highest Rating</option>
                <option value="orders">Most Orders</option>
                <option value="recent">Recent Activity</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSuppliers.map(supplier => (
            <div
              key={supplier.id}
              className="supplier-card bg-[#1A1A1A] border border-white/5 rounded-xl overflow-hidden hover:border-[#5E54F2]/50 transition-all"
            >
              {/* Header with Logo */}
              <div className="p-6 pb-0">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-xl bg-gradient-to-br from-[#3B82F6] to-[#2563EB] ${supplier.logoColor}`}>
                      {supplier.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">{supplier.name}</h3>
                      <p className="text-sm text-[#94A3B8]">{supplier.category}</p>
                    </div>
                  </div>
                  <DeleteSupplierModal id={supplier.id} onDelete={fetchSuppliers} />
                </div>
                
                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < supplier.rating ? 'text-[#F97316]' : 'text-gray-600'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-white">{supplier.rating}.0</span>
                  <span className="text-sm text-[#94A3B8]">({supplier.reviews} reviews)</span>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Supplier Card */}
          <div className="supplier-card bg-[#1A1A1A] border-2 border-dashed border-white/10 rounded-xl hover:border-[#5E54F2]/50 transition-all cursor-pointer group">
            <div className="h-full flex flex-col items-center justify-center p-8 min-h-[460px]">
              <div className="w-16 h-16 bg-[#5E54F2]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#5E54F2]/20 transition-colors">
                <svg className="w-8 h-8 text-[#5E54F2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Add New Supplier</h3>
              <p className="text-sm text-[#94A3B8] text-center">Connect with new suppliers and vendors</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuppliersManagement;