import React, { useState } from "react";

export default function AddSupplierModal() {
  const [openModal, setOpenModal] = useState(false);

  const showModal = () => setOpenModal(true);
  const cancelModal = () => setOpenModal(false);

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
        اضافة مورد
      </button>

      {openModal && (
        <div
          dir="rtl"
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 fade-modal-enter-active"
          onClick={cancelModal}
          style={{ animation: "fadeIn 0.4s ease-out forwards" }}
        >
          <div
            className="bg-[#1A1A1A] rounded-2xl h-[90%] w-full border border-white/5 shadow-2xl modal-content-enter-active"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation:
                "modalBounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards",
            }}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/5 bg-gradient-to-r from-[#5E54F2] to-[#7C3AED] rounded-t-2xl flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">اضافة مورد</h3>
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

            {/* Body */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-[#0F0F0F] border border-white/10 rounded-lg text-white placeholder-[#94A3B8] focus:border-[#5E54F2] focus:outline-none focus:ring-1 focus:ring-[#5E54F2]"
                  placeholder="Enter product name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                    Product ID
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-[#0F0F0F] border border-white/10 rounded-lg text-white placeholder-[#94A3B8] focus:border-[#5E54F2] focus:outline-none focus:ring-1 focus:ring-[#5E54F2]"
                    placeholder="#WH000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                    Price
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-[#0F0F0F] border border-white/10 rounded-lg text-white placeholder-[#94A3B8] focus:border-[#5E54F2] focus:outline-none focus:ring-1 focus:ring-[#5E54F2]"
                    placeholder="$0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                  Category
                </label>
                <select
                  className="w-full px-4 py-2 bg-[#0F0F0F] border border-white/10 rounded-lg text-white focus:border-[#5E54F2] focus:outline-none focus:ring-1 focus:ring-[#5E54F2]"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  <option>Storage Equipment</option>
                  <option>Material Handling</option>
                  <option>Safety Equipment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                  Initial Stock
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2 bg-[#0F0F0F] border border-white/10 rounded-lg text-white placeholder-[#94A3B8] focus:border-[#5E54F2] focus:outline-none focus:ring-1 focus:ring-[#5E54F2]"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Footer */}
            <div
              dir="rtl"
              className="px-6 py-3 border-t border-white/5 flex items-center justify-start gap-3"
            >
              <button className="px-6 py-2 bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#F97316]/25 transition-all">
                اضافة مورد
              </button>
              <button
                onClick={cancelModal}
                className="px-5 py-2 text-[#94A3B8] hover:text-white transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>

          <style>{`
            /* Backdrop fade and blur */
            @keyframes fadeIn {
              from {
                opacity: 0;
                backdrop-filter: blur(0px);
              }
              to {
                opacity: 1;
                backdrop-filter: blur(8px);
                background-color: rgba(0, 0, 0, 0.6);
              }
            }
            /* Modal animation - bouncy entrance */
            @keyframes modalBounceIn {
              0% {
                opacity: 0;
                transform: scale(0.3) translateY(-100px) rotate(-10deg);
              }
              50% {
                transform: scale(1.05) translateY(10px) rotate(2deg);
              }
              100% {
                opacity: 1;
                transform: scale(1) translateY(0) rotate(0deg);
              }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
