import React, { useState, useRef } from "react";

export default function AddOfferModal() {
  const [openModal, setOpenModal] = useState(false);
  const [offerImage, setOfferImage] = useState("");
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    productName: "",
    productId: "",
    price: "",
    category: "",
    initialStock: "",
  });

  const showModal = () => setOpenModal(true);
  const cancelModal = () => {
    setOpenModal(false);
    resetForm();
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      productName: "",
      productId: "",
      price: "",
      category: "",
      initialStock: "",
    });
    setOfferImage("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const uploadImg = async (file) => {
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("file", file);
      const token = localStorage.getItem("token");
      const res = await fetch("https://products-api.cbc-apps.net/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      setOfferImage(data.url);
    } catch (e) {
      console.error(e);
    }
  };

  const deleteImg = () => setOfferImage("");

  const submitOffer = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await fetch("https://products-api.cbc-apps.net/offers/general", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...form, image: offerImage, isActive: true }),
      });
      cancelModal();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <button
        onClick={showModal}
        className="px-4 py-2 bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#F97316]/25 transition-all flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
        اضافة عرض
      </button>

      {openModal && (
        <div
          dir="rtl"
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && cancelModal()}
        >
          <div className="bg-[#1A1A1A] rounded-2xl h-[90%] w-full max-w-4xl border border-white/5 shadow-2xl relative">
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/5 bg-gradient-to-r from-[#5E54F2] to-[#7C3AED] rounded-t-2xl flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">اضافة عرض</h3>
              <button
                onClick={cancelModal}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* Body */}
            <form
              onSubmit={submitOffer}
              className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-80px)]"
            >
              {/* Offer Details */}
              <div>
                <label className="block text-sm text-[#94A3B8] mb-2">عنوان العرض</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-[#0F0F0F] border border-white/10 rounded-lg text-white"
                  placeholder="عنوان العرض"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-[#94A3B8] mb-2">الوصف</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-[#0F0F0F] border border-white/10 rounded-lg text-white"
                  placeholder="اكتب وصف العرض"
                  required
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#94A3B8] mb-2">تاريخ البداية</label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-[#0F0F0F] border border-white/10 rounded-lg text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#94A3B8] mb-2">تاريخ النهاية</label>
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-[#0F0F0F] border border-white/10 rounded-lg text-white"
                    required
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                {!offerImage ? (
                  <label className="cursor-pointer block">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => uploadImg(e.target.files[0])}
                    />
                    <div className="h-40 border-2 border-dashed border-gray-500 flex items-center justify-center rounded-lg text-gray-400">
                      رفع صورة العرض
                    </div>
                  </label>
                ) : (
                  <div className="relative w-full h-40 rounded-lg overflow-hidden">
                    <img src={offerImage} alt="offer" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={deleteImg}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>

              {/* Product Fields */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  name="productName"
                  value={form.productName}
                  onChange={handleChange}
                  placeholder="اسم المنتج"
                  className="px-4 py-2 bg-[#0F0F0F] border border-white/10 rounded-lg text-white"
                  required
                />
                <input
                  name="productId"
                  value={form.productId}
                  onChange={handleChange}
                  placeholder="رقم المنتج"
                  className="px-4 py-2 bg-[#0F0F0F] border border-white/10 rounded-lg text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="السعر"
                  className="px-4 py-2 bg-[#0F0F0F] border border-white/10 rounded-lg text-white"
                  required
                />
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="px-4 py-2 bg-[#0F0F0F] border border-white/10 rounded-lg text-white"
                  required
                >
                  <option value="">اختر التصنيف</option>
                  <option value="Storage Equipment">Storage Equipment</option>
                  <option value="Material Handling">Material Handling</option>
                  <option value="Safety Equipment">Safety Equipment</option>
                </select>
              </div>

              <input
                name="initialStock"
                type="number"
                min="0"
                value={form.initialStock}
                onChange={handleChange}
                placeholder="المخزون"
                className="w-full px-4 py-2 bg-[#0F0F0F] border border-white/10 rounded-lg text-white"
                required
              />

              {/* Footer */}
              <div className="px-6 py-3 border-t border-white/5 flex items-center gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white font-semibold rounded-lg"
                >
                  حفظ العرض
                </button>
                <button
                  type="button"
                  onClick={cancelModal}
                  className="px-5 py-2 text-[#94A3B8] hover:text-white"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
