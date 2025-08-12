import React, { useState } from "react";

export default function AddOfferModal() {
  const [openModal, setOpenModal] = useState(false);
  const [form, setForm] = useState({
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
      productName: "",
      productId: "",
      price: "",
      category: "",
      initialStock: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const submitOffer = (e) => {
    e.preventDefault();
    // هنا ممكن تضيف منطق الإرسال للAPI أو تخزين البيانات
    console.log("Submitted offer:", form);
    cancelModal();
  };

  return (
    <>
      <button
        onClick={showModal}
        className="px-4 py-2 bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#F97316]/25 transition-all flex items-center gap-2"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4v16m8-8H4"
          />
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
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-white/5 bg-gradient-to-r from-[#5E54F2] to-[#7C3AED] rounded-t-2xl flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">اضافة عرض</h3>
              <button
                onClick={cancelModal}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <form
              onSubmit={submitOffer}
              className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-80px)]"
            >
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                  Product Name
                </label>
                <input
                  name="productName"
                  value={form.productName}
                  onChange={handleChange}
                  type="text"
                  className="w-full px-4 py-2 bg-[#0F0F0F] border border-white/10 rounded-lg text-white placeholder-[#94A3B8] focus:border-[#5E54F2] focus:outline-none focus:ring-1 focus:ring-[#5E54F2]"
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                    Product ID
                  </label>
                  <input
                    name="productId"
                    value={form.productId}
                    onChange={handleChange}
                    type="text"
                    className="w-full px-4 py-2 bg-[#0F0F0F] border border-white/10 rounded-lg text-white placeholder-[#94A3B8] focus:border-[#5E54F2] focus:outline-none focus:ring-1 focus:ring-[#5E54F2]"
                    placeholder="#WH000"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                    Price
                  </label>
                  <input
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    type="text"
                    className="w-full px-4 py-2 bg-[#0F0F0F] border border-white/10 rounded-lg text-white placeholder-[#94A3B8] focus:border-[#5E54F2] focus:outline-none focus:ring-1 focus:ring-[#5E54F2]"
                    placeholder="$0.00"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-[#0F0F0F] border border-white/10 rounded-lg text-white focus:border-[#5E54F2] focus:outline-none focus:ring-1 focus:ring-[#5E54F2]"
                  required
                >
                  <option value="">Select category</option>
                  <option value="Storage Equipment">Storage Equipment</option>
                  <option value="Material Handling">Material Handling</option>
                  <option value="Safety Equipment">Safety Equipment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                  Initial Stock
                </label>
                <input
                  name="initialStock"
                  value={form.initialStock}
                  onChange={handleChange}
                  type="number"
                  className="w-full px-4 py-2 bg-[#0F0F0F] border border-white/10 rounded-lg text-white placeholder-[#94A3B8] focus:border-[#5E54F2] focus:outline-none focus:ring-1 focus:ring-[#5E54F2]"
                  placeholder="0"
                  min="0"
                  required
                />
              </div>

              {/* Modal Footer */}
              <div
                dir="rtl"
                className="px-6 py-3 border-t border-white/5 flex items-center justify-start gap-3"
              >
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#F97316]/25 transition-all"
                >
                  اضافة عرض
                </button>
                <button
                  type="button"
                  onClick={cancelModal}
                  className="px-5 py-2 text-[#94A3B8] hover:text-white transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
