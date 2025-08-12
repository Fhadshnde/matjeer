import React, { useState } from "react";
import { createPortal } from "react-dom";

export default function DeleteProductModal({ id, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);

  const showModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const deleteProduct = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://products-api.cbc-apps.net/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete product");
      
      if (onDelete) {
        onDelete(id);
      }
      
      closeModal();
    } catch (e) {
      console.error(e);
    }
  };

  const modalContent = (
    <div
      onClick={(e) => e.target === e.currentTarget && closeModal()}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-400 ease-out"
    >
      <div className="bg-[#1A1A1A] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-white/5 shadow-2xl transition-transform duration-500 ease-out">
        <div className="px-6 py-4 border-b border-white/5 bg-gradient-to-r from-[#ea3b0a] to-[#7C3AED] rounded-t-2xl flex items-center justify-between sticky top-0 z-10">
          <h3 className="text-xl font-bold text-white">Delete product</h3>
          <button
            onClick={closeModal}
            className="text-white/80 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6 cursor-pointer"
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
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]"></div>
        <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between bg-[#1A1A1A] rounded-b-2xl sticky bottom-0">
          <h1 className="text-[#e8120f] font-bold">* You cannot restore it</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={closeModal}
              type="button"
              className="px-5 py-2 cursor-pointer text-[#94A3B8] hover:text-white transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={deleteProduct}
              type="button"
              className="px-6 py-2 cursor-pointer bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#F97316]/25 transition-all"
            >
              Delete Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <svg
        onClick={showModal}
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        viewBox="0 0 24 24"
        className="cursor-pointer"
        fill="currentColor"
      >
        <path d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z" />
      </svg>

      {isOpen && createPortal(modalContent, document.body)}
    </>
  );
}