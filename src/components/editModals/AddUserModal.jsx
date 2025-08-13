import React, { useState } from "react";

export default function AddUserModal() {
  const [openModal, setOpenModal] = useState(false);

  const showModal = () => setOpenModal(true);
  const cancelModal = () => setOpenModal(false);

  return (
    <>
      <style>{`
        /* Backdrop fade and blur */
        .fade-modal-enter-active,
        .fade-modal-leave-active {
          transition: all 0.4s ease-out;
        }
        .fade-modal-enter-from,
        .fade-modal-leave-to {
          opacity: 0;
          backdrop-filter: blur(0px);
        }
        .fade-modal-enter-to,
        .fade-modal-leave-from {
          opacity: 1;
          backdrop-filter: blur(8px);
          background-color: rgba(0, 0, 0, 0.6);
        }

        /* Modal animation - bouncy entrance, smooth exit */
        .modal-content-enter-active {
          animation: modal-bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        .modal-content-leave-active {
          animation: modal-zoom-out 0.3s ease-in forwards;
        }

        @keyframes modal-bounce-in {
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

        @keyframes modal-zoom-out {
          0% {
            opacity: 1;
            transform: scale(1) translateY(0) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: scale(0.5) translateY(50px) rotate(5deg);
          }
        }

        /* Tailwind-like utility classes */
        .btn-orange {
          padding: 0.5rem 1rem;
          background: linear-gradient(to right, #F97316, #EA580C);
          color: white;
          font-weight: 600;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
        }
        .btn-orange:hover {
          box-shadow: 0 4px 15px rgba(249, 115, 22, 0.25);
        }
        .modal-container {
          background-color: #1A1A1A;
          border-radius: 1rem;
          height: 90vh;
          width: 100%;
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 10px 40px rgba(0,0,0,0.6);
          display: flex;
          flex-direction: column;
        }
        .modal-header {
          padding: 1.5rem 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          background: linear-gradient(to right, #5E54F2, #7C3AED);
          border-top-left-radius: 1rem;
          border-top-right-radius: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: white;
        }
        .modal-body {
          padding: 1.5rem;
          flex-grow: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          color: #94A3B8;
        }
        .modal-footer {
          padding: 1rem 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.05);
          display: flex;
          justify-content: flex-start;
          gap: 0.75rem;
          direction: rtl;
          background: #1A1A1A;
        }
        label {
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
          display: block;
        }
        input, select {
          width: 100%;
          padding: 0.5rem 1rem;
          background-color: #0F0F0F;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 0.5rem;
          color: white;
          font-size: 1rem;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        input::placeholder {
          color: #94A3B8;
        }
        input:focus, select:focus {
          border-color: #5E54F2;
          box-shadow: 0 0 0 1px #5E54F2;
        }
        .grid-2-cols {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        .btn-cancel {
          padding: 0.5rem 1.25rem;
          background: none;
          border: none;
          color: #94A3B8;
          font-weight: 500;
          cursor: pointer;
          transition: color 0.2s ease;
        }
        .btn-cancel:hover {
          color: white;
        }
        /* Scrollbar for modal body */
        .modal-body::-webkit-scrollbar {
          width: 6px;
        }
        .modal-body::-webkit-scrollbar-thumb {
          background-color: rgba(94, 84, 242, 0.5);
          border-radius: 3px;
        }
      `}</style>

      {/* زر فتح المودال */}
      <button onClick={showModal} className="btn-orange" dir="rtl" type="button" aria-haspopup="dialog" aria-expanded={openModal}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" width={20} height={20}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        اضافة مستخدم
      </button>

      {/* المودال */}
      {openModal && (
        <div
          dir="rtl"
          className="fade-modal-enter-to fade-modal-enter-active fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-content-enter-active modal-container" style={{ animationFillMode: "forwards" }}>
            {/* رأس المودال */}
            <div className="modal-header">
              <h3 className="text-xl font-bold">اضافة مستخدم</h3>
              <button onClick={cancelModal} aria-label="Close modal" style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255 255 255 / 0.8)" }}>
                <svg width={24} height={24} fill="none" stroke="currentColor" viewBox="0 0 24 24" >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* محتوى المودال */}
            <div className="modal-body">
              <div>
                <label htmlFor="productName">Product Name</label>
                <input id="productName" type="text" placeholder="Enter product name" />
              </div>

              <div className="grid-2-cols">
                <div>
                  <label htmlFor="productId">Product ID</label>
                  <input id="productId" type="text" placeholder="#WH000" />
                </div>
                <div>
                  <label htmlFor="price">Price</label>
                  <input id="price" type="text" placeholder="$0.00" />
                </div>
              </div>

              <div>
                <label htmlFor="category">Category</label>
                <select id="category" defaultValue="">
                  <option disabled value="">
                    Select category
                  </option>
                  <option>Storage Equipment</option>
                  <option>Material Handling</option>
                  <option>Safety Equipment</option>
                </select>
              </div>

              <div>
                <label htmlFor="stock">Initial Stock</label>
                <input id="stock" type="number" placeholder="0" />
              </div>
            </div>

            {/* تذييل المودال */}
            <div className="modal-footer">
              <button className="btn-orange">اضافة مستخدم</button>
              <button className="btn-cancel" onClick={cancelModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
