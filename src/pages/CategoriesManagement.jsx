import React, { useState, useEffect } from 'react';
// Assuming these are your modal components. You'll need to create them.
import AddCategoryModal from '../components/AddModals/AddCategoryModal';
import EditCategoryModal from '../components/editModals/EditCategoryModal';
import DeleteCategoryModal from '../components/DeleteModal/DeleteCategoryModal';

const CategoriesManagement = () => {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      // Replace with your actual API call.
      const response = await fetch('http://31.97.35.42:4500/categories');
      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      {/* Header */}
      <div className="bg-[#1A1A1A]/80 border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Categories Management</h1>
            </div>
            <AddCategoryModal onSubmit={fetchCategories} />
          </div>
        </div>
      </div>

      {/* Category Stats */}
      <div dir="rtl" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#5E54F2]/20 to-[#7C3AED]/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-[#5E54F2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>
              <span className="text-xs text-[#10B981] font-semibold bg-[#10B981]/20 px-2 py-1 rounded-full">+12%</span>
            </div>
            <h3 className="text-[#94A3B8] text-sm">مجموع الاقسام</h3>
            <p className="text-2xl font-bold text-white mt-1">24</p>
          </div>

          <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#3B82F6]/20 to-[#2563EB]/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
              </div>
              <span className="text-xs text-[#F97316] font-semibold bg-[#F97316]/20 px-2 py-1 rounded-full">+5%</span>
            </div>
            <h3 className="text-[#94A3B8] text-sm">مجموع المنتجات</h3>
            <p className="text-2xl font-bold text-white mt-1">1,847</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="relative">
          {/* Your search bar content */}
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              dir="rtl"
              className="category-card bg-[#1A1A1A] border border-white/5 rounded-xl p-6 hover:border-[#5E54F2]/50 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#5E54F2] to-[#7C3AED] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <img className="rounded-xl" src={category.image} alt={category.name} />
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 text-[#94A3B8] hover:text-white hover:bg-white/5 rounded-lg transition-all">
                    <EditCategoryModal categoryId={category.id} onSubmit={fetchCategories} />
                  </button>
                  <button className="p-2 text-[#94A3B8] hover:text-red-400 hover:bg-white/5 rounded-lg transition-all">
                    <DeleteCategoryModal id={category.id} onDelete={fetchCategories} />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-white mb-2">{category.name}</h3>
              <p className="text-sm text-[#94A3B8] mb-4">{category.description}</p>
            </div>
          ))}

          {/* Empty State for Add New */}
          <div className="category-card bg-[#1A1A1A] border border-dashed border-white/10 rounded-xl p-6 hover:border-[#5E54F2]/50 transition-all cursor-pointer group">
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <div className="w-16 h-16 bg-[#5E54F2]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#5E54F2]/20 transition-colors">
                <svg className="w-8 h-8 text-[#5E54F2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Add New Category</h3>
              <p className="text-sm text-[#94A3B8]">Create a new category to organize products</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesManagement;