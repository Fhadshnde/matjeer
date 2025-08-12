import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { createPortal } from 'react-dom';

const apiBaseUrl = 'https://products-api.cbc-apps.net';

const getMediaType = (file) => {
  if (file.type && file.type.startsWith('image/')) return 'image';
  if (file.type && file.type.startsWith('video/')) return 'video';
  
  const url = file.url || file.name;
  if (!url) return 'unknown';

  const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|webp|svg)(\?.*)?$/i;
  const videoExtensions = /\.(mp4|webm|ogg|avi|mov|wmv|flv|mkv)(\?.*)?$/i;
  
  if (imageExtensions.test(url)) return 'image';
  if (videoExtensions.test(url)) return 'video';
  
  return 'unknown';
};

const AddProductModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [sections, setSections] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    originalPrice: '',
    price: '',
    stock: '',
    mainImageUrl: '',
    categoryId: '',
    sectionId: '',
    supplierId: '',
    colors: [],
    media: [],
  });
  
  const modalRef = useRef(null);

  const showModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setProductData({
      name: '',
      description: '',
      originalPrice: '',
      price: '',
      stock: '',
      mainImageUrl: '',
      categoryId: '',
      sectionId: '',
      supplierId: '',
      colors: [],
      media: [],
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setProductData(prevData => ({
      ...prevData,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  const handleColorChange = (index, e) => {
    const { name, value, type } = e.target;
    const newColors = [...productData.colors];
    newColors[index] = {
      ...newColors[index],
      [name]: type === 'number' ? parseInt(value, 10) : value,
    };
    setProductData(prevData => ({ ...prevData, colors: newColors }));
  };

  const handleSizeChange = (colorIndex, sizeIndex, e) => {
    const { value } = e.target;
    const newColors = [...productData.colors];
    newColors[colorIndex].sizes[sizeIndex] = {
      ...newColors[colorIndex].sizes[sizeIndex],
      stock: parseInt(value, 10),
    };
    setProductData(prevData => ({ ...prevData, colors: newColors }));
  };

  const addColor = () => {
    setProductData(prevData => ({
      ...prevData,
      colors: [
        ...prevData.colors,
        { name: '', code: '#5E54F2', stock: 0, sizes: null },
      ],
    }));
  };

  const removeColor = (index) => {
    const newColors = [...productData.colors];
    newColors.splice(index, 1);
    setProductData(prevData => ({ ...prevData, colors: newColors }));
  };

  const toggleSizes = (index) => {
    const newColors = [...productData.colors];
    if (newColors[index].sizes) {
      newColors[index].sizes = null;
    } else {
      newColors[index].sizes = [
        { size: 'S', stock: 0 },
        { size: 'M', stock: 0 },
        { size: 'L', stock: 0 },
        { size: 'XL', stock: 0 },
      ];
    }
    setProductData(prevData => ({ ...prevData, colors: newColors }));
  };

  const uploadFile = async (file) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(`${apiBaseUrl}/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.url;
    } catch (error) {
      console.error('Upload failed:', error);
      alert('فشل في رفع الملف');
      return null;
    }
  };

  const uploadMainImage = async (file) => {
    const url = await uploadFile(file);
    if (url) {
      setProductData(prevData => ({ ...prevData, mainImageUrl: url }));
    }
  };

  const deleteMainImage = () => {
    setProductData(prevData => ({ ...prevData, mainImageUrl: '' }));
  };

  const uploadMedia = async (file) => {
    const url = await uploadFile(file);
    if (url) {
      const type = getMediaType(file);
      setProductData(prevData => ({
        ...prevData,
        media: [...prevData.media, { url, type }],
      }));
    }
  };

  const deleteMedia = (index) => {
    const newMedia = [...productData.media];
    newMedia.splice(index, 1);
    setProductData(prevData => ({ ...prevData, media: newMedia }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productData.name || !productData.price || !productData.stock || 
        !productData.mainImageUrl || !productData.categoryId || 
        !productData.sectionId || !productData.supplierId) {
      alert('يرجى ملء جميع الحقول المطلوبة.');
      return;
    }

    const dataToSend = {
      ...productData,
      // التحقق من أنواع البيانات وتحويلها إلى أرقام
      originalPrice: productData.originalPrice ? parseFloat(productData.originalPrice) : null,
      price: parseFloat(productData.price),
      stock: parseInt(productData.stock, 10),
      categoryId: parseInt(productData.categoryId, 10),
      sectionId: parseInt(productData.sectionId, 10),
      supplierId: parseInt(productData.supplierId, 10),
      colors: productData.colors.map(color => ({
        ...color,
        stock: parseInt(color.stock, 10),
        sizes: color.sizes ? color.sizes.map(size => ({
          ...size,
          stock: parseInt(size.stock, 10)
        })) : null,
      }))
    };

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${apiBaseUrl}/products`, dataToSend, {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });

      console.log('Product added successfully:', response.data);
      alert('تم إضافة المنتج بنجاح!');
      closeModal();
      
      window.location.reload(); 
      
    } catch (error) {
      console.error('Failed to add product:', error);
      alert('فشل في إضافة المنتج. يرجى التحقق من البيانات.');
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${apiBaseUrl}/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(response.data.categories);
      } catch (e) {
        console.error('Failed to fetch categories:', e);
      }
    };
    
    const fetchSuppliers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${apiBaseUrl}/suppliers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuppliers(response.data);
      } catch (e) {
        console.error('Failed to fetch suppliers:', e);
      }
    };

    fetchCategories();
    fetchSuppliers();
  }, []);

  useEffect(() => {
    const fetchSections = async () => {
      if (productData.categoryId) {
        try {
          const response = await axios.get(`${apiBaseUrl}/sections/category/${productData.categoryId}`);
          setSections(response.data.sections);
        } catch (e) {
          console.error('Failed to fetch sections:', e);
          setSections([]);
        }
      } else {
        setSections([]);
      }
    };
    fetchSections();
  }, [productData.categoryId]);
  
  const discountPercentage = 
    (productData.originalPrice && productData.price) 
      ? Math.round(((productData.originalPrice - productData.price) / productData.originalPrice) * 100)
      : null;

  const modalContent = (
    <div
      className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-400 ease-out ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
    >
      <div
        ref={modalRef}
        className={`bg-[#1A1A1A] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-white/5 shadow-2xl transition-transform duration-500 ease-out ${
          isOpen ? 'scale-100 animate-bounceIn' : 'scale-75 animate-zoomOut'
        }`}
      >
        <div className="px-6 py-4 border-b border-white/5 bg-gradient-to-r from-[#5E54F2] to-[#7C3AED] rounded-t-2xl flex items-center justify-between sticky top-0 z-10">
          <h3 className="text-xl font-bold text-white">إضافة منتج جديد</h3>
          <button onClick={closeModal} className="text-white/80 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-[#5E54F2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                معلومات أساسية
              </h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-2">اسم المنتج *</label>
                  <input
                    value={productData.name}
                    onChange={handleInputChange}
                    name="name"
                    type="text" 
                    required
                    className="w-full px-4 py-2 bg-[#0F0F0F] border border-white/10 rounded-lg text-white placeholder-[#94A3B8] focus:border-[#5E54F2] focus:outline-none focus:ring-1 focus:ring-[#5E54F2]" 
                    placeholder="أدخل اسم المنتج"
                  />
                </div>
                <div>
                  {!productData.mainImageUrl ? (
                    <div className="rounded-lg shadow-sm">
                      <label className="cursor-pointer">
                        <input onChange={e => uploadMainImage(e.target.files[0])} type="file" accept="image/*" className="hidden" />
                        <div className="relative h-fit w-fit border-2 border-dashed border-gray-300 hover:border-blue-500 bg-gray-50 hover:bg-blue-50 rounded-xl flex items-center justify-center p-4 text-center transition duration-200">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div className="w-fit h-fit">
                      <img className='h-24 w-24 object-cover' src={productData.mainImageUrl} alt="Main product" />
                      <button type="button" className="bg-red-400 cursor-pointer w-24 rounded-b-xl mx-auto block" onClick={deleteMainImage}>
                        حذف
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div className="relative group">
                  <label htmlFor="additional-upload" className="block cursor-pointer">
                    <div className="aspect-square border-2 border-dashed border-white/10 rounded-lg p-4 hover:border-[#5E54F2]/50 transition-all bg-[#0F0F0F] group-hover:bg-[#0F0F0F]/70 flex items-center justify-center">
                      <svg className="w-8 h-8 text-[#94A3B8] group-hover:text-[#5E54F2] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                      </svg>
                    </div>
                  </label>
                  <input onChange={e => uploadMedia(e.target.files[0])} type="file" id="additional-upload" className="hidden" accept="image/*,video/*" />
                </div>
                {productData.media.map((media, index) => (
                  <div key={index} className="relative group">
                    {media.url && getMediaType(media) === 'image' ? (
                      <img
                        src={media.url}
                        alt="Product media"
                        className="w-full aspect-square border-2 border-dashed border-white/10 rounded-lg p-4 hover:border-[#5E54F2]/50 transition-all bg-[#0F0F0F] group-hover:bg-[#0F0F0F]/70 object-cover"
                        onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
                      />
                    ) : media.url && getMediaType(media) === 'video' ? (
                      <video
                        src={media.url}
                        className="w-full aspect-square border-2 border-dashed border-white/10 rounded-lg p-4 hover:border-[#5E54F2]/50 transition-all bg-[#0F0F0F] group-hover:bg-[#0F0F0F]/70 object-cover"
                        controls
                        muted
                        preload="metadata"
                      >
                        <source src={media.url} type="video/mp4" />
                        متصفحك لا يدعم تشغيل الفيديو.
                      </video>
                    ) : null}
                    {media.url && (
                    <button
                      type="button"
                      onClick={() => deleteMedia(index)}
                      className="absolute bottom-0 left-0 right-0 bg-red-400 hover:bg-red-500 cursor-pointer rounded-b-xl transition-colors px-3 py-2 text-white text-sm"
                    >
                      حذف
                    </button>
                    )}
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-2">الوصف</label>
                <textarea
                  value={productData.description}
                  onChange={handleInputChange}
                  name="description"
                  rows="3"
                  className="w-full px-4 py-2 bg-[#0F0F0F] border border-white/10 rounded-lg text-white placeholder-[#94A3B8] focus:border-[#5E54F2] focus:outline-none focus:ring-1 focus:ring-[#5E54F2] resize-none"
                  placeholder="أدخل وصف المنتج"
                ></textarea>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                التسعير والمخزون
              </h4>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-2">السعر الأصلي</label>
                  <input
                    value={productData.originalPrice}
                    onChange={handleInputChange}
                    name="originalPrice"
                    type="number"
                    step="0.01"
                    className="w-full px-4 py-2 bg-[#0F0F0F] border border-white/10 rounded-lg text-white placeholder-[#94A3B8] focus:border-[#5E54F2] focus:outline-none focus:ring-1 focus:ring-[#5E54F2]"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-2">سعر البيع *</label>
                  <input
                    value={productData.price}
                    onChange={handleInputChange}
                    name="price"
                    type="number"
                    step="0.01"
                    required
                    className="w-full px-4 py-2 bg-[#0F0F0F] border border-white/10 rounded-lg text-white placeholder-[#94A3B8] focus:border-[#5E54F2] focus:outline-none focus:ring-1 focus:ring-[#5E54F2]"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-2">إجمالي المخزون *</label>
                  <input
                    value={productData.stock}
                    onChange={handleInputChange}
                    name="stock"
                    type="number"
                    required
                    className="w-full px-4 py-2 bg-[#0F0F0F] border border-white/10 rounded-lg text-white placeholder-[#94A3B8] focus:border-[#5E54F2] focus:outline-none focus:ring-1 focus:ring-[#5E54F2]"
                    placeholder="0"
                  />
                </div>
                {discountPercentage && (
                  <div className="flex flex-col justify-end">
                    <div className="text-center p-2 bg-[#F97316]/20 rounded-lg">
                      <p className="text-xs text-[#94A3B8]">الخصم</p>
                      <p className="text-lg font-bold text-[#F97316]">
                        {discountPercentage}%
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
                التصنيف
              </h4>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-2">الفئة *</label>
                  <select
                    value={productData.categoryId}
                    onChange={handleInputChange}
                    name="categoryId"
                    required
                    className="w-full px-4 py-2 bg-[#0F0F0F] border border-white/10 rounded-lg text-white focus:border-[#5E54F2] focus:outline-none focus:ring-1 focus:ring-[#5E54F2]"
                  >
                    <option value="" disabled>اختر فئة</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-2">القسم *</label>
                  <select
                    value={productData.sectionId}
                    onChange={handleInputChange}
                    name="sectionId"
                    required
                    className="w-full px-4 py-2 bg-[#0F0F0F] border border-white/10 rounded-lg text-white focus:border-[#5E54F2] focus:outline-none focus:ring-1 focus:ring-[#5E54F2]"
                  >
                    <option value="" disabled>اختر قسم</option>
                    {sections.map(section => (
                      <option key={section.id} value={section.id}>
                        {section.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-2">المورد *</label>
                  <select
                    value={productData.supplierId}
                    onChange={handleInputChange}
                    name="supplierId"
                    required
                    className="w-full px-4 py-2 bg-[#0F0F0F] border border-white/10 rounded-lg text-white focus:border-[#5E54F2] focus:outline-none focus:ring-1 focus:ring-[#5E54F2]"
                  >
                    <option value="" disabled>اختر مورد</option>
                    {suppliers.map(supplier => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#8B5CF6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
                  </svg>
                  الألوان والمتغيرات
                </h4>
                <button
                  onClick={addColor}
                  type="button"
                  className="px-3 py-1.5 bg-[#5E54F2]/20 text-[#5E54F2] text-sm font-medium rounded-lg hover:bg-[#5E54F2]/30 transition-all flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  إضافة لون
                </button>
              </div>
              <div className="space-y-4">
                {productData.colors.length > 0 ? (
                  productData.colors.map((color, colorIndex) => (
                    <div key={colorIndex} className="bg-[#0F0F0F] border border-white/10 rounded-xl p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <input
                            value={color.code}
                            onChange={e => handleColorChange(colorIndex, e)}
                            name="code"
                            type="color"
                            className="w-12 h-12 bg-transparent border-0 rounded-lg cursor-pointer"
                          />
                          <div className="flex-1">
                            <input
                              value={color.name}
                              onChange={e => handleColorChange(colorIndex, e)}
                              name="name"
                              type="text"
                              placeholder="اسم اللون"
                              className="w-full px-3 py-1.5 bg-[#1A1A1A] border border-white/10 rounded-lg text-white placeholder-[#94A3B8] focus:border-[#5E54F2] focus:outline-none text-sm"
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => removeColor(colorIndex)}
                          type="button"
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-white/5 rounded-lg transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        </button>
                      </div>
                      <div className="mb-3">
                        <label className="text-xs text-[#94A3B8]">المخزون لهذا اللون</label>
                        <input
                          value={color.stock}
                          onChange={e => handleColorChange(colorIndex, e)}
                          name="stock"
                          type="number"
                          placeholder="0"
                          className="w-full mt-1 px-3 py-1.5 bg-[#1A1A1A] border border-white/10 rounded-lg text-white placeholder-[#94A3B8] focus:border-[#5E54F2] focus:outline-none text-sm"
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs text-[#94A3B8]">مقاسات مختلفة (اختياري)</label>
                          <button
                            onClick={() => toggleSizes(colorIndex)}
                            type="button"
                            className="text-xs text-[#F97316] hover:text-[#EA580C] font-medium"
                          >
                            {color.sizes ? 'إزالة المقاسات' : 'إضافة مقاسات'}
                          </button>
                        </div>
                        {color.sizes && (
                          <div className="grid grid-cols-3 gap-2">
                            {color.sizes.map((size, sizeIndex) => (
                              <div key={size.size} className="flex items-center gap-2">
                                <span className="text-sm text-white w-8">{size.size}:</span>
                                <input
                                  value={size.stock}
                                  onChange={e => handleSizeChange(colorIndex, sizeIndex, e)}
                                  type="number"
                                  placeholder="0"
                                  className="flex-1 px-2 py-1 bg-[#1A1A1A] border border-white/10 rounded text-white placeholder-[#94A3B8] focus:border-[#5E54F2] focus:outline-none text-sm"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-[#94A3B8]">
                    <svg className="w-12 h-12 mx-auto mb-3 text-[#94A3B8]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
                    </svg>
                    <p className="text-sm">لم يتم إضافة أي ألوان بعد</p>
                    <p className="text-xs mt-1">اضغط "إضافة لون" لإضافة متغيرات الألوان</p>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between bg-[#1A1A1A] rounded-b-2xl sticky bottom-0">
          <p className="text-xs text-[#94A3B8]">* الحقول المطلوبة</p>
          <div className="flex items-center gap-3">
            <button
              onClick={closeModal}
              type="button"
              className="px-5 py-2 text-[#94A3B8] hover:text-white transition-colors font-medium"
            >
              إلغاء
            </button>
            <button
              onClick={handleSubmit}
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#F97316]/25 transition-all"
            >
              إضافة المنتج
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button onClick={showModal} className="px-4 py-2 bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#F97316]/25 transition-all flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
        </svg>
        إضافة منتج
      </button>
      {isOpen && createPortal(modalContent, document.body)}
    </>
  );
};

export default AddProductModal;