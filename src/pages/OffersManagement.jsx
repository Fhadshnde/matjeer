import React, { useState, useEffect, useRef } from "react";
import {
  MdEdit,
  MdDelete,
  MdToggleOn,
  MdToggleOff,
  MdLayers,
  MdOutlineCloudUpload,
  MdClose,
  MdSearch,
  MdFilterList,
  MdDownload,
  MdInfoOutline
} from "react-icons/md";

export default function OffersManagement() {
  const [offers, setOffers] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sections, setSections] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOffer, setSelectedOffer] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOffers();
    fetchProducts();
    fetchCategories();
    fetchSections();
  }, []);

  const fetchOffers = async () => {
    try {
      const res = await fetch("https://products-api.cbc-apps.net/offers/general", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOffers(data);
      return data;
    } catch (e) {
      console.error(e);
      setOffers([]);
      return [];
    }
  };

  const fetchActiveOffers = async () => {
    try {
      const res = await fetch("https://products-api.cbc-apps.net/offers/general/active", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOffers(data);
    } catch (e) {
      console.error(e);
      setOffers([]);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch("https://products-api.cbc-apps.net/products?limit=1000", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProductsList(data.products || []);
    } catch (e) {
      setProductsList([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("https://products-api.cbc-apps.net/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : data.categories || []);
    } catch (e) {
      setCategories([]);
    }
  };

  const fetchSections = async () => {
    try {
      const res = await fetch("https://products-api.cbc-apps.net/sections", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSections(Array.isArray(data) ? data : data.sections || []);
    } catch (e) {
      setSections([]);
    }
  };

  const fetchOfferProducts = async (id) => {
    try {
      const res = await fetch(`https://products-api.cbc-apps.net/offers/general/${id}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return await res.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  };
  
  const fetchOfferDetailsAndOpenModal = async (offerId) => {
    try {
        const res = await fetch(`https://products-api.cbc-apps.net/offers/general/${offerId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setSelectedOffer(data);
    } catch (e) {
        console.error(e);
    }
  };
  
  const handleCloseModal = () => {
    setSelectedOffer(null);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "all") {
      fetchOffers();
    } else if (tab === "active") {
      fetchActiveOffers();
    } else if (tab === "inactive") {
      fetchOffers().then(data => {
        if (Array.isArray(data)) {
          setOffers(data.filter((offer) => !offer.isActive));
        }
      });
    }
  };

  function AddOfferModal({ onSubmit }) {
    const [openModal, setOpenModal] = useState(false);
    const [offerImage, setOfferImage] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [selectedProductIds, setSelectedProductIds] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [selectedSectionId, setSelectedSectionId] = useState("");
    const fileInputRef = useRef(null);

    const showModal = () => setOpenModal(true);
    const cancelModal = () => {
      setOpenModal(false);
      setOfferImage("");
      setTitle("");
      setDescription("");
      setStartDate("");
      setEndDate("");
      setIsActive(true);
      setSelectedProductIds([]);
      setSelectedCategoryId("");
      setSelectedSectionId("");
    };

    const uploadImg = async (file) => {
      if (!file) return;
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("https://products-api.cbc-apps.net/upload", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        const data = await res.json();
        setOfferImage(data.url);
      } catch (e) {}
    };

    const deleteImg = () => setOfferImage("");

    const toggleProductSelection = (id) => {
      if (selectedProductIds.includes(id)) {
        setSelectedProductIds(selectedProductIds.filter((pid) => pid !== id));
      } else {
        setSelectedProductIds([...selectedProductIds, id]);
      }
    };

    const addOffer = async () => {
      if (!title || !description || selectedProductIds.length === 0) return;
      if (!selectedCategoryId || !selectedSectionId) return;

      const selectedProducts = productsList.filter((p) =>
        selectedProductIds.includes(p.id)
      );

      const body = {
        title,
        description,
        image: offerImage,
        isActive,
        startDate,
        endDate,
        categoryId: Number(selectedCategoryId),
        sectionId: Number(selectedSectionId),
        products: selectedProducts.map((p) => ({
          productId: p.id,
          discountPercentage: p.discountPercentage || 20,
        })),
      };
      try {
        await fetch("https://products-api.cbc-apps.net/offers/general", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
        cancelModal();
        if (onSubmit) onSubmit();
      } catch (e) {
      }
    };

    const onModalContentClick = (e) => e.stopPropagation();

    return (
      <>
        <button
          onClick={showModal}
          className="px-4 py-2 bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#F97316]/25 transition-all flex items-center gap-2"
        >
          <MdLayers size={20} />
          اضافة عرض
        </button>

        {openModal && (
          <div
            dir="rtl"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={cancelModal}
          >
            <div
              className="bg-[#1A1A1A] rounded-2xl h-[90%] w-full border border-white/5 shadow-2xl max-w-lg overflow-y-auto"
              onClick={onModalContentClick}
            >
              <div className="px-6 py-4 border-b border-white/5 bg-gradient-to-r from-[#5E54F2] to-[#7C3AED] rounded-t-2xl flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">اضافة عرض</h3>
                <button
                  onClick={cancelModal}
                  className="text-white/80 hover:text-white"
                >
                  <MdClose size={24} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="عنوان العرض"
                  className="w-full px-3 py-2 rounded-lg border bg-gray-50 text-gray-800"
                />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="وصف العرض"
                  className="w-full px-3 py-2 rounded-lg border bg-gray-50 text-gray-800"
                />
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border bg-gray-50 text-gray-800"
                  />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border bg-gray-50 text-gray-800"
                  />
                </div>
                <label className="flex items-center gap-2 text-white">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 text-orange-500 bg-gray-100 rounded border-gray-300 focus:ring-orange-500"
                  />
                  تفعيل العرض
                </label>

                <select
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border bg-gray-50 text-gray-800"
                >
                  <option value="">اختر الفئة</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedSectionId}
                  onChange={(e) => setSelectedSectionId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border bg-gray-50 text-gray-800"
                >
                  <option value="">اختر القسم</option>
                  {sections.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>

                {!offerImage ? (
                  <label className="cursor-pointer rounded-lg shadow-sm w-full">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={(e) => uploadImg(e.target.files[0])}
                    />
                    <div className="relative h-48 w-full border-2 border-dashed border-gray-300 hover:border-blue-500 bg-gray-50 hover:bg-blue-50 rounded-xl flex items-center justify-center text-center transition duration-200">
                      <MdOutlineCloudUpload size={40} className="text-gray-400" />
                      <span className="text-gray-400 font-bold">رفع صورة العرض</span>
                    </div>
                  </label>
                ) : (
                  <div className="relative w-full h-48 rounded-xl overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      src={offerImage}
                      alt="Offer"
                    />
                    <button
                      onClick={deleteImg}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full text-xs shadow-md"
                    >
                      <MdClose size={16} />
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto border border-white/10 rounded-lg p-2 bg-[#0F0F0F]">
                  {productsList.map((p) => (
                    <label
                      key={p.id}
                      className="flex items-center gap-2 p-1 cursor-pointer text-white"
                    >
                      <input
                        type="checkbox"
                        checked={selectedProductIds.includes(p.id)}
                        onChange={() => toggleProductSelection(p.id)}
                        className="w-4 h-4 text-orange-500 bg-gray-100 rounded border-gray-300 focus:ring-orange-500"
                      />
                      {p.name}
                    </label>
                  ))}
                </div>
              </div>

              <div className="px-6 py-3 border-t border-white/5 flex items-center justify-start gap-3">
                <button
                  onClick={addOffer}
                  className="px-6 py-2 bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#F97316]/25 transition-all"
                >
                  اضافة عرض
                </button>
                <button
                  onClick={cancelModal}
                  className="px-5 py-2 text-[#94A3B8] hover:text-white transition-colors font-medium"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  function EditOfferModal({ offer, onSubmit }) {
    const [openModal, setOpenModal] = useState(false);
    const [offerImage, setOfferImage] = useState(offer.image);
    const [title, setTitle] = useState(offer.title);
    const [description, setDescription] = useState(offer.description);
    const [startDate, setStartDate] = useState(offer.startDate.split("T")[0]);
    const [endDate, setEndDate] = useState(offer.endDate.split("T")[0]);
    const [isActive, setIsActive] = useState(offer.isActive);
    const fileInputRef = useRef(null);

    const showModal = () => setOpenModal(true);
    const cancelModal = () => setOpenModal(false);

    const uploadImg = async (file) => {
      if (!file) return;
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("https://products-api.cbc-apps.net/upload", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        const data = await res.json();
        setOfferImage(data.url);
      } catch (e) {}
    };

    const deleteImg = () => setOfferImage("");

    const updateOffer = async () => {
      const body = {
        title,
        description,
        image: offerImage,
        isActive,
        startDate,
        endDate,
      };
      try {
        await fetch(`https://products-api.cbc-apps.net/offers/general/${offer.id}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
        cancelModal();
        if (onSubmit) onSubmit();
      } catch (e) {
      }
    };
    
    const onModalContentClick = (e) => e.stopPropagation();

    return (
      <>
        <button
          onClick={showModal}
          className="p-2 rounded-full bg-blue-600/30 text-blue-400 hover:bg-blue-600/50 transition-colors"
        >
          <MdEdit size={20} />
        </button>

        {openModal && (
          <div
            dir="rtl"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={cancelModal}
          >
            <div
              className="bg-[#1A1A1A] rounded-2xl w-full border border-white/5 shadow-2xl max-w-lg overflow-y-auto"
              onClick={onModalContentClick}
            >
              <div className="px-6 py-4 border-b border-white/5 bg-gradient-to-r from-[#5E54F2] to-[#7C3AED] rounded-t-2xl flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">تعديل عرض</h3>
                <button
                  onClick={cancelModal}
                  className="text-white/80 hover:text-white"
                >
                  <MdClose size={24} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="عنوان العرض"
                  className="w-full px-3 py-2 rounded-lg border bg-gray-50 text-gray-800"
                />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="وصف العرض"
                  className="w-full px-3 py-2 rounded-lg border bg-gray-50 text-gray-800"
                />
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border bg-gray-50 text-gray-800"
                  />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border bg-gray-50 text-gray-800"
                  />
                </div>
                <label className="flex items-center gap-2 text-white">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 text-orange-500 bg-gray-100 rounded border-gray-300 focus:ring-orange-500"
                  />
                  تفعيل العرض
                </label>
                {!offerImage ? (
                  <label className="cursor-pointer rounded-lg shadow-sm w-full">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={(e) => uploadImg(e.target.files[0])}
                    />
                    <div className="relative h-48 w-full border-2 border-dashed border-gray-300 hover:border-blue-500 bg-gray-50 hover:bg-blue-50 rounded-xl flex items-center justify-center text-center transition duration-200">
                      <MdOutlineCloudUpload size={40} className="text-gray-400" />
                      <span className="text-gray-400 font-bold">رفع صورة العرض</span>
                    </div>
                  </label>
                ) : (
                  <div className="relative w-full h-48 rounded-xl overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      src={offerImage}
                      alt="Offer"
                    />
                    <button
                      onClick={deleteImg}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full text-xs shadow-md"
                    >
                      <MdClose size={16} />
                    </button>
                  </div>
                )}
              </div>
              <div className="px-6 py-3 border-t border-white/5 flex items-center justify-start gap-3">
                <button
                  onClick={updateOffer}
                  className="px-6 py-2 bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#F97316]/25 transition-all"
                >
                  حفظ التعديلات
                </button>
                <button
                  onClick={cancelModal}
                  className="px-5 py-2 text-[#94A3B8] hover:text-white transition-colors font-medium"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  function DeleteOfferModal({ offer, onSubmit }) {
    const [openModal, setOpenModal] = useState(false);
    const showModal = () => setOpenModal(true);
    const cancelModal = () => setOpenModal(false);

    const deleteOffer = async () => {
      try {
        await fetch(`https://products-api.cbc-apps.net/offers/general/${offer.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        cancelModal();
        if (onSubmit) onSubmit();
      } catch (e) {
      }
    };
    
    const onModalContentClick = (e) => e.stopPropagation();

    return (
      <>
        <button
          onClick={showModal}
          className="p-2 rounded-full bg-red-600/30 text-red-400 hover:bg-red-600/50 transition-colors"
        >
          <MdDelete size={20} />
        </button>
        {openModal && (
          <div
            dir="rtl"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={cancelModal}
          >
            <div
              className="bg-[#1A1A1A] rounded-2xl w-full border border-white/5 shadow-2xl max-w-sm"
              onClick={onModalContentClick}
            >
              <div className="p-6 text-center">
                <MdDelete size={60} className="text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  هل أنت متأكد؟
                </h3>
                <p className="text-sm text-[#94A3B8]">
                  سيتم حذف العرض "{offer.title}" بشكل نهائي. لا يمكن التراجع عن هذا الإجراء.
                </p>
              </div>
              <div className="px-6 py-3 border-t border-white/5 flex items-center justify-center gap-3">
                <button
                  onClick={deleteOffer}
                  className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                >
                  حذف
                </button>
                <button
                  onClick={cancelModal}
                  className="px-5 py-2 text-[#94A3B8] hover:text-white transition-colors font-medium"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  function ManageProductsModal({ offer, onSubmit }) {
    const [openModal, setOpenModal] = useState(false);
    const [offerProducts, setOfferProducts] = useState([]);
    const [availableProducts, setAvailableProducts] = useState([]);
    const [selectedProductsToAdd, setSelectedProductsToAdd] = useState([]);
    
    const fetchAndSetOfferProducts = async (id) => {
      try {
        const offerProductsData = await fetchOfferProducts(id);
        setOfferProducts(offerProductsData);

        const offerProductIds = offerProductsData.map(p => p.id);
        setAvailableProducts(productsList.filter(p => !offerProductIds.includes(p.id)));
      } catch (e) {
      }
    };

    useEffect(() => {
      if (openModal && offer?.id) {
        fetchAndSetOfferProducts(offer.id);
      }
    }, [openModal, offer?.id, productsList]);

    const showModal = () => setOpenModal(true);
    const cancelModal = () => setOpenModal(false);

    const toggleProductSelection = (id) => {
      if (selectedProductsToAdd.includes(id)) {
        setSelectedProductsToAdd(selectedProductsToAdd.filter((pid) => pid !== id));
      } else {
        setSelectedProductsToAdd([...selectedProductsToAdd, id]);
      }
    };

    const addProductsToOffer = async () => {
      if (selectedProductsToAdd.length === 0) return;
      const defaultDiscount = 20;
      
      try {
        for (const productId of selectedProductsToAdd) {
          const body = {
            productId: productId,
            discountPercentage: defaultDiscount,
          };
          await fetch(`https://products-api.cbc-apps.net/offers/general/${offer.id}/products`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });
        }
        setSelectedProductsToAdd([]);
        fetchAndSetOfferProducts(offer.id);
        if (onSubmit) onSubmit();
      } catch (e) {
      }
    };
    
    const deleteProductFromOffer = async (productId) => {
      try {
        await fetch(`https://products-api.cbc-apps.net/offers/general/${offer.id}/products/${productId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchAndSetOfferProducts(offer.id);
        if (onSubmit) onSubmit();
      } catch (e) {
      }
    };

    const onModalContentClick = (e) => e.stopPropagation();

    return (
      <>
        <button
          onClick={showModal}
          className="p-2 rounded-full bg-orange-600/30 text-orange-400 hover:bg-orange-600/50 transition-colors"
        >
          <MdLayers size={20} />
        </button>

        {openModal && (
          <div
            dir="rtl"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={cancelModal}
          >
            <div
              className="bg-[#1A1A1A] rounded-2xl h-[90%] w-full border border-white/5 shadow-2xl max-w-lg overflow-y-auto"
              onClick={onModalContentClick}
            >
              <div className="px-6 py-4 border-b border-white/5 bg-gradient-to-r from-[#5E54F2] to-[#7C3AED] rounded-t-2xl flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">
                  ادارة منتجات عرض "{offer.title}"
                </h3>
                <button
                  onClick={cancelModal}
                  className="text-white/80 hover:text-white"
                >
                  <MdClose size={24} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="border border-white/10 rounded-lg p-4 bg-[#0F0F0F]">
                  <h4 className="text-lg font-semibold text-white mb-3">منتجات العرض الحالية</h4>
                  <ul className="space-y-2">
                    {offerProducts.length > 0 ? (
                      offerProducts.map((p) => (
                        <li key={p.id} className="flex justify-between items-center bg-[#2A2A2A] rounded-lg p-2 text-white">
                          <span>{p.name}</span>
                          <button
                            onClick={() => deleteProductFromOffer(p.id)}
                            className="text-red-400 hover:text-red-500"
                          >
                            <MdDelete size={20} />
                          </button>
                        </li>
                      ))
                    ) : (
                      <p className="text-center text-[#94A3B8]">لا توجد منتجات في هذا العرض.</p>
                    )}
                  </ul>
                </div>

                <div className="border border-white/10 rounded-lg p-4 bg-[#0F0F0F]">
                  <h4 className="text-lg font-semibold text-white mb-3">اضافة منتجات جديدة</h4>
                  <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                    {availableProducts.length > 0 ? (
                      availableProducts.map((p) => (
                        <label
                          key={p.id}
                          className="flex items-center gap-2 p-1 cursor-pointer text-white"
                        >
                          <input
                            type="checkbox"
                            checked={selectedProductsToAdd.includes(p.id)}
                            onChange={() => toggleProductSelection(p.id)}
                            className="w-4 h-4 text-orange-500 bg-gray-100 rounded border-gray-300 focus:ring-orange-500"
                          />
                          {p.name}
                        </label>
                      ))
                    ) : (
                      <p className="col-span-2 text-center text-[#94A3B8]">لا توجد منتجات متاحة للإضافة.</p>
                    )}
                  </div>
                  <button
                    onClick={addProductsToOffer}
                    disabled={selectedProductsToAdd.length === 0}
                    className="mt-4 w-full px-6 py-2 bg-gradient-to-r from-[#5E54F2] to-[#7C3AED] text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    اضافة المنتجات المحددة
                  </button>
                </div>
              </div>
              
              <div className="px-6 py-3 border-t border-white/5 flex items-center justify-start">
                <button
                  onClick={cancelModal}
                  className="px-5 py-2 text-[#94A3B8] hover:text-white transition-colors font-medium"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  function ShowOfferDetailsModal({ offer, onClose }) {
    if (!offer) return null;
    const onModalContentClick = (e) => e.stopPropagation();

    return (
      <div
        dir="rtl"
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-[#1A1A1A] rounded-2xl w-full border border-white/5 shadow-2xl max-w-lg h-[90%] overflow-y-auto"
          onClick={onModalContentClick}
        >
          <div className="px-6 py-4 border-b border-white/5 bg-gradient-to-r from-[#5E54F2] to-[#7C3AED] rounded-t-2xl flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">تفاصيل العرض</h3>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white"
            >
              <MdClose size={24} />
            </button>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex flex-col items-center">
              <img
                src={offer.image}
                alt={offer.title}
                className="w-full h-48 object-cover rounded-xl shadow-lg border border-white/10"
              />
              <h4 className="text-2xl font-bold text-white mt-4">{offer.title}</h4>
              <p className="text-[#94A3B8] text-center mt-2">{offer.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-white/80">
              <div>
                <span className="font-semibold text-white">الحالة: </span>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    offer.isActive
                      ? "bg-green-500/10 text-green-500 ring-1 ring-inset ring-green-500/20"
                      : "bg-red-500/10 text-red-500 ring-1 ring-inset ring-red-500/20"
                  }`}
                >
                  {offer.isActive ? "مفعل" : "غير مفعل"}
                </span>
              </div>
              <div>
                <span className="font-semibold text-white">الفئة: </span>
                {offer.category?.name || 'غير محدد'}
              </div>
              <div>
                <span className="font-semibold text-white">القسم: </span>
                {offer.section?.name || 'غير محدد'}
              </div>
              <div>
                <span className="font-semibold text-white">تاريخ البدء: </span>
                {new Date(offer.startDate).toLocaleDateString()}
              </div>
              <div>
                <span className="font-semibold text-white">تاريخ الانتهاء: </span>
                {new Date(offer.endDate).toLocaleDateString()}
              </div>
            </div>
            
            <div className="border border-white/10 rounded-lg p-4 bg-[#0F0F0F]">
              <h4 className="text-lg font-semibold text-white mb-3">المنتجات في هذا العرض</h4>
              <ul className="space-y-2">
                {offer.products && offer.products.length > 0 ? (
                  offer.products.map((p) => (
                    <li key={p.productId} className="flex justify-between items-center bg-[#2A2A2A] rounded-lg p-3 text-white">
                      <span>{p.product.name}</span>
                      <span className="text-orange-400 font-semibold">{p.discountPercentage}% خصم</span>
                    </li>
                  ))
                ) : (
                  <p className="text-center text-[#94A3B8]">لا توجد منتجات في هذا العرض.</p>
                )}
              </ul>
            </div>
          </div>
          <div className="px-6 py-3 border-t border-white/5 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 text-[#94A3B8] hover:text-white transition-colors font-medium"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    );
  }


  const toggleOfferStatus = async (offerId) => {
    try {
      await fetch(`https://products-api.cbc-apps.net/offers/general/${offerId}/toggle`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchOffers();
    } catch (e) {
    }
  };

  const deactivateOffer = async (offerId) => {
    try {
      await fetch(`https://products-api.cbc-apps.net/offers/general/${offerId}/deactivate`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchOffers();
    } catch (e) {
    }
  };

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          offer.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = (activeTab === "all") ||
                       (activeTab === "active" && offer.isActive) ||
                       (activeTab === "inactive" && !offer.isActive);
    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      <div className="bg-[#1A1A1A]/80 border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold text-white">Offers Management</h1>
            <p className="text-sm text-[#94A3B8] mt-1">
              Create and manage special deals and promotions
            </p>
          </div>
          <AddOfferModal onSubmit={fetchOffers} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
          <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4" dir="rtl">
            <div className="flex-1 w-full max-w-md sm:max-w-none relative">
              <input
                type="text"
                placeholder="بحث..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-white/10 bg-[#0F0F0F] text-white focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10"
              />
              <MdSearch className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleTabClick("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "all"
                    ? "bg-[#5E54F2] text-white shadow-lg shadow-[#5E54F2]/25"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                جميع العروض
              </button>
              <button
                onClick={() => handleTabClick("active")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "active"
                    ? "bg-[#5E54F2] text-white shadow-lg shadow-[#5E54F2]/25"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                العروض المفعلة
              </button>
              <button
                onClick={() => handleTabClick("inactive")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "inactive"
                    ? "bg-[#5E54F2] text-white shadow-lg shadow-[#5E54F2]/25"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                العروض الموقوفة
              </button>
              <button className="px-4 py-2 text-[#94A3B8] border border-[#94A3B8]/20 rounded-lg hover:bg-[#94A3B8]/10 transition-colors flex items-center gap-1">
                <MdFilterList size={20} />
                تصفية
              </button>
              <button className="px-4 py-2 text-[#94A3B8] border border-[#94A3B8]/20 rounded-lg hover:bg-[#94A3B8]/10 transition-colors flex items-center gap-1">
                <MdDownload size={20} />
                تصدير
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm text-[#94A3B8]">
              <thead className="text-xs text-white uppercase bg-[#1A1A1A]/50">
                <tr>
                  <th scope="col" className="py-3 px-6 rounded-tr-lg">العنوان</th>
                  <th scope="col" className="py-3 px-6">الوصف</th>
                  <th scope="col" className="py-3 px-6">الصورة</th>
                  <th scope="col" className="py-3 px-6">الحالة</th>
                  <th scope="col" className="py-3 px-6">تاريخ البدء</th>
                  <th scope="col" className="py-3 px-6">تاريخ الانتهاء</th>
                  <th scope="col" className="py-3 px-6 rounded-tl-lg text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredOffers.length > 0 ? (
                  filteredOffers.map((offer) => (
                    <tr key={offer.id} className="bg-[#1A1A1A] border-b border-white/5">
                      <td className="py-4 px-6 font-medium text-white whitespace-nowrap">
                        {offer.title}
                      </td>
                      <td className="py-4 px-6">{offer.description}</td>
                      <td className="py-4 px-6">
                        <img src={offer.image} alt={offer.title} className="w-16 h-16 object-cover rounded" />
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            offer.isActive
                              ? "bg-green-500/10 text-green-500 ring-1 ring-inset ring-green-500/20"
                              : "bg-red-500/10 text-red-500 ring-1 ring-inset ring-red-500/20"
                          }`}
                        >
                          {offer.isActive ? "مفعل" : "غير مفعل"}
                        </span>
                      </td>
                      <td className="py-4 px-6">{offer.startDate.split("T")[0]}</td>
                      <td className="py-4 px-6">{offer.endDate.split("T")[0]}</td>
                      <td className="py-4 px-6 flex items-center justify-center gap-2">
                        <EditOfferModal offer={offer} onSubmit={fetchOffers} />
                        <DeleteOfferModal offer={offer} onSubmit={fetchOffers} />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleOfferStatus(offer.id);
                          }}
                          className={`p-2 rounded-full transition-colors ${
                            offer.isActive
                              ? "bg-green-600/30 text-green-400 hover:bg-green-600/50"
                              : "bg-gray-600/30 text-gray-400 hover:bg-gray-600/50"
                          }`}
                          title={offer.isActive ? "تعطيل العرض" : "تفعيل العرض"}
                        >
                          {offer.isActive ? <MdToggleOn size={20} /> : <MdToggleOff size={20} />}
                        </button>
                        <ManageProductsModal offer={offer} onSubmit={fetchOffers} />
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                fetchOfferDetailsAndOpenModal(offer.id);
                            }}
                            className="p-2 rounded-full bg-indigo-600/30 text-indigo-400 hover:bg-indigo-600/50 transition-colors"
                            title="عرض التفاصيل"
                        >
                            <MdInfoOutline size={20} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-10 text-white/50">
                      لا توجد عروض لعرضها.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <ShowOfferDetailsModal
        offer={selectedOffer}
        onClose={handleCloseModal}
      />
    </div>
  );
}