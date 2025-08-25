import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://products-api.cbc-apps.net';

const Discounts = () => {
    const [discounts, setDiscounts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentDiscount, setCurrentDiscount] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [startDateFilter, setStartDateFilter] = useState('');
    const [endDateFilter, setEndDateFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const discountsPerPage = 10;

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        type: 'PERCENTAGE',
        value: 0,
        categoryId: '',
        productId: '',
        startDate: '',
        endDate: '',
        isActive: true
    });

    const getAuthHeaders = () => {
        const token = localStorage.getItem("token");
        if (!token) return {};
        return { headers: { Authorization: `Bearer ${token}` } };
    };

    const fetchDiscounts = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/discounts`, getAuthHeaders());
            setDiscounts(response.data);
        } catch (error) {
            console.error(error);
        }
        setIsLoading(false);
    };

    const fetchProductsAndCategories = async () => {
        try {
            const headers = getAuthHeaders();
            const productsResponse = await axios.get(`${API_BASE_URL}/products`, { ...headers, params: { limit: 50 } });
            const categoriesResponse = await axios.get(`${API_BASE_URL}/categories`, headers);
            setProducts(productsResponse.data.products);
            setCategories(categoriesResponse.data.categories);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchDiscounts();
        fetchProductsAndCategories();
    }, []);

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };
    
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            type: formData.type,
            value: Number(formData.value),
            startDate: formData.startDate,
            endDate: formData.endDate,
            isActive: formData.isActive
        };

        if (formData.categoryId !== '') payload.categoryId = Number(formData.categoryId);
        if (formData.productId !== '') payload.productId = Number(formData.productId);

        try {
            if (currentDiscount) {
                await axios.patch(`${API_BASE_URL}/discounts/${currentDiscount.id}`, payload, getAuthHeaders());
            } else {
                await axios.post(`${API_BASE_URL}/discounts`, payload, getAuthHeaders());
            }
            setIsModalOpen(false);
            setCurrentDiscount(null);
            setFormData({ type: 'PERCENTAGE', value: 0, categoryId: '', productId: '', startDate: '', endDate: '', isActive: true });
            fetchDiscounts();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteDiscount = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/discounts/${id}`, getAuthHeaders());
            fetchDiscounts();
        } catch (error) {
            console.error(error);
        }
    };

    const handleEditDiscount = (discount) => {
        setCurrentDiscount(discount);
        setFormData({ ...discount, categoryId: discount.categoryId || '', productId: discount.productId || '' });
        setIsModalOpen(true);
    };

    const filteredDiscounts = discounts.filter(discount => {
        const matchesSearch = searchTerm === '' || discount.type.toLowerCase().includes(searchTerm.toLowerCase()) || String(discount.value).includes(searchTerm);
        const matchesStartDate = startDateFilter === '' || new Date(discount.startDate) >= new Date(startDateFilter);
        const matchesEndDate = endDateFilter === '' || new Date(discount.endDate) <= new Date(endDateFilter);
        return matchesSearch && matchesStartDate && matchesEndDate;
    });

    const indexOfLastDiscount = currentPage * discountsPerPage;
    const indexOfFirstDiscount = indexOfLastDiscount - discountsPerPage;
    const currentDiscounts = filteredDiscounts.slice(indexOfFirstDiscount, indexOfLastDiscount);
    const totalPages = Math.ceil(filteredDiscounts.length / discountsPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const renderPagination = () => {
        const pages = [];
        const maxPagesToShow = 5;
        const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
        if (startPage > 1) {
            pages.push(<button key="first" onClick={() => paginate(1)} className="px-3 py-1 mx-1 rounded-md text-gray-500 bg-gray-100">1</button>);
            if (startPage > 2) pages.push(<span key="start-dots" className="px-3 py-1 mx-1 text-gray-500">...</span>);
        }
    
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button key={i} onClick={() => paginate(i)} className={`px-3 py-1 mx-1 rounded-md ${currentPage === i ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {i}
                </button>
            );
        }
    
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) pages.push(<span key="end-dots" className="px-3 py-1 mx-1 text-gray-500">...</span>);
            pages.push(<button key="last" onClick={() => paginate(totalPages)} className="px-3 py-1 mx-1 rounded-md text-gray-500 bg-gray-100">{totalPages}</button>);
        }
        return pages;
    };

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <div className="flex-1 p-8">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">إدارة الخصومات</h2>
                        <div className="flex space-x-2 rtl:space-x-reverse">
                            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md">تصدير</button>
                            <button onClick={() => { setCurrentDiscount(null); setFormData({ type: 'PERCENTAGE', value: 0, categoryId: '', productId: '', startDate: '', endDate: '', isActive: true }); setIsModalOpen(true); }} className="bg-indigo-500 text-white px-4 py-2 rounded-md">إضافة خصم</button>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between mb-6 space-y-4 md:space-y-0 md:space-x-4 rtl:space-x-reverse">
                        <div className="flex items-center w-full md:w-auto">
                            <input type="text" placeholder="ماذا تبحث عن؟" className="w-full md:w-80 border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                        <div className="flex items-center w-full md:w-auto space-x-4 rtl:space-x-reverse">
                            <div className="flex items-center">
                                <label className="text-gray-600 ml-2 rtl:mr-2">من تاريخ</label>
                                <input type="date" className="border border-gray-300 p-2 rounded-md" value={startDateFilter} onChange={(e) => setStartDateFilter(e.target.value)} />
                            </div>
                            <div className="flex items-center">
                                <label className="text-gray-600 ml-2 rtl:mr-2">إلى تاريخ</label>
                                <input type="date" className="border border-gray-300 p-2 rounded-md" value={endDateFilter} onChange={(e) => setEndDateFilter(e.target.value)} />
                            </div>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-10 text-gray-500">جاري تحميل البيانات...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border-collapse">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="py-3 px-4 text-sm font-semibold text-gray-600 uppercase tracking-wider text-right">النوع</th>
                                        <th className="py-3 px-4 text-sm font-semibold text-gray-600 uppercase tracking-wider text-right">القيمة</th>
                                        <th className="py-3 px-4 text-sm font-semibold text-gray-600 uppercase tracking-wider text-right">الفئة</th>
                                        <th className="py-3 px-4 text-sm font-semibold text-gray-600 uppercase tracking-wider text-right">المنتج</th>
                                        <th className="py-3 px-4 text-sm font-semibold text-gray-600 uppercase tracking-wider text-right">تاريخ البدء</th>
                                        <th className="py-3 px-4 text-sm font-semibold text-gray-600 uppercase tracking-wider text-right">تاريخ الانتهاء</th>
                                        <th className="py-3 px-4 text-sm font-semibold text-gray-600 uppercase tracking-wider text-right">فعال</th>
                                        <th className="py-3 px-4 text-sm font-semibold text-gray-600 uppercase tracking-wider text-right">الإجراءات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentDiscounts.map(discount => (
                                        <tr key={discount.id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm text-gray-800 text-right">{discount.type}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800 text-right">{discount.value}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800 text-right">{discount.category?.name || 'غير محدد'}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800 text-right">{discount.product?.name || 'غير محدد'}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800 text-right">{new Date(discount.startDate).toLocaleDateString()}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800 text-right">{new Date(discount.endDate).toLocaleDateString()}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800 text-right">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${discount.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {discount.isActive ? 'نعم' : 'لا'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-800 text-right">
                                                <div className="flex space-x-2 rtl:space-x-reverse">
                                                    <button onClick={() => handleEditDiscount(discount)} className="text-blue-600 hover:text-blue-800">تعديل</button>
                                                    <button onClick={() => handleDeleteDiscount(discount.id)} className="text-red-600 hover:text-red-800">حذف</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    <div className="mt-6 flex justify-between items-center">
                        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50">السابق</button>
                        <div className="flex">{renderPagination()}</div>
                        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50">التالي</button>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="relative p-8 bg-white w-96 rounded-lg shadow-xl">
                        <h3 className="text-xl font-bold mb-4">{currentDiscount ? 'تعديل الخصم' : 'إضافة خصم جديد'}</h3>
                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-700">النوع</label>
                                <select name="type" value={formData.type} onChange={handleFormChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md">
                                    <option value="PERCENTAGE">نسبة مئوية</option>
                                    <option value="FIXED">مبلغ ثابت</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700">القيمة</label>
                                <input type="number" name="value" value={formData.value} onChange={handleFormChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md" required />
                            </div>
                            <div>
                                <label className="block text-gray-700">الفئة</label>
                                <select name="categoryId" value={formData.categoryId} onChange={handleFormChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md">
                                    <option value="">اختر فئة (اختياري)</option>
                                    {categories.map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700">المنتج</label>
                                <select name="productId" value={formData.productId} onChange={handleFormChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md">
                                    <option value="">اختر منتج (اختياري)</option>
                                    {products.map(prod => (<option key={prod.id} value={prod.id}>{prod.name}</option>))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700">تاريخ البدء</label>
                                <input type="date" name="startDate" value={formData.startDate} onChange={handleFormChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md" required />
                            </div>
                            <div>
                                <label className="block text-gray-700">تاريخ الانتهاء</label>
                                <input type="date" name="endDate" value={formData.endDate} onChange={handleFormChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md" required />
                            </div>
                            <div className="flex items-center">
                                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleFormChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                                <label className="ml-2 block text-gray-900 rtl:mr-2">فعال</label>
                            </div>
                            <div className="flex justify-end space-x-2 rtl:space-x-reverse">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md">إلغاء</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-500 text-white rounded-md">حفظ</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Discounts;