import React, { useState } from "react";

export default function CategoryDetailsModal() {
  const [openModal, setOpenModal] = useState(false);

  const view = () => setOpenModal(true);
  const cancelModal = () => setOpenModal(false);

  return (
    <>
      <button
        onClick={view}
        className="text-[#F97316] hover:text-[#EA580C] font-medium text-sm flex items-center gap-1 group"
      >
        View
        <svg
          className="w-4 h-4 transition-transform group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {openModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 fade-modal-enter-active"
          onClick={cancelModal}
          style={{ animation: "fadeIn 0.4s ease-out forwards" }}
        >
          <div
            className="bg-[#1A1A1A] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-white/5 shadow-2xl modal-content-enter-active"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation:
                "modalBounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards",
            }}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-white/5 bg-gradient-to-r from-[#5E54F2] to-[#7C3AED]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Storage Equipment
                    </h3>
                    <p className="text-sm text-white/80">Category Details</p>
                  </div>
                </div>
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
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto max-h-[calc(90vh-180px)]">
              {/* Category Stats */}
              <div className="p-6 border-b border-white/5">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-[#0F0F0F] rounded-lg p-4">
                    <p className="text-xs text-[#94A3B8] mb-1">Total Products</p>
                    <p className="text-2xl font-bold text-white">342</p>
                    <p className="text-xs text-[#10B981] mt-1">+12% this month</p>
                  </div>
                  <div className="bg-[#0F0F0F] rounded-lg p-4">
                    <p className="text-xs text-[#94A3B8] mb-1">Total Value</p>
                    <p className="text-2xl font-bold text-[#10B981]">$125K</p>
                    <p className="text-xs text-[#10B981] mt-1">+8% this month</p>
                  </div>
                  <div className="bg-[#0F0F0F] rounded-lg p-4">
                    <p className="text-xs text-[#94A3B8] mb-1">Low Stock Items</p>
                    <p className="text-2xl font-bold text-[#F97316]">23</p>
                    <p className="text-xs text-[#F97316] mt-1">Needs attention</p>
                  </div>
                  <div className="bg-[#0F0F0F] rounded-lg p-4">
                    <p className="text-xs text-[#94A3B8] mb-1">Out of Stock</p>
                    <p className="text-2xl font-bold text-red-500">7</p>
                    <p className="text-xs text-red-500 mt-1">Critical</p>
                  </div>
                </div>
              </div>

              {/* Category Info */}
              <div className="p-6 border-b border-white/5">
                <h4 className="text-lg font-semibold text-white mb-4">
                  Category Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-[#94A3B8] mb-2 block">
                      Description
                    </label>
                    <p className="text-white">
                      Industrial shelving units, storage racks, bins, and
                      organizational systems for efficient warehouse space
                      utilization.
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-[#94A3B8] mb-2 block">
                      Created Date
                    </label>
                    <p className="text-white">January 15, 2024</p>
                  </div>
                </div>
              </div>

              {/* Top Products */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-white">Top Products</h4>
                  <button className="text-[#F97316] hover:text-[#EA580C] text-sm font-medium">
                    View All
                  </button>
                </div>

                <div className="space-y-3">
                  {/* Product Row */}
                  <ProductRow
                    name="Heavy Duty Shelving Unit"
                    sku="WH-001"
                    price="$299.99"
                    stock="245 in stock"
                    stockClass="text-[#10B981]"
                  />
                  <ProductRow
                    name="Industrial Storage Rack"
                    sku="WH-002"
                    price="$189.99"
                    stock="18 in stock"
                    stockClass="text-[#F97316]"
                  />
                  <ProductRow
                    name="Storage Bins Set"
                    sku="WH-003"
                    price="$49.99"
                    stock="Out of stock"
                    stockClass="text-red-500"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
              <button className="px-4 py-2 text-red-400 hover:text-red-300 font-medium transition-colors flex items-center gap-2">
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete Category
              </button>
              <div className="flex items-center gap-3">
                <button
                  onClick={cancelModal}
                  className="px-5 py-2 text-[#94A3B8] hover:text-white transition-colors font-medium"
                >
                  Close
                </button>
                <button className="px-6 py-2 bg-gradient-to-r from-[#5E54F2] to-[#7C3AED] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#5E54F2]/25 transition-all">
                  Edit Category
                </button>
              </div>
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

function ProductRow({ name, sku, price, stock, stockClass }) {
  return (
    <div className="flex items-center justify-between p-4 bg-[#0F0F0F] rounded-lg hover:bg-[#0F0F0F]/80 transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-[#5E54F2]/20 to-[#7C3AED]/20 rounded-lg flex items-center justify-center">
          <svg
            className="w-6 h-6 text-[#5E54F2]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
        <div>
          <p className="font-medium text-white">{name}</p>
          <p className="text-sm text-[#94A3B8]">SKU: {sku}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold text-white">{price}</p>
        <p className={`text-sm ${stockClass}`}>{stock}</p>
      </div>
    </div>
  );
}
