import { useState, useRef } from "react";

export default function AddOfferModal({ onSubmit }) {
  const [openModal, setOpenModal] = useState(false);
  const [offerImage, setOfferImage] = useState("");
  const fileInputRef = useRef(null);

  const showModal = () => setOpenModal(true);

  const cancelModal = () => {
    setOpenModal(false);
    setOfferImage("");
  };

  const uploadImg = async (file) => {
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("file", file);
      const token = localStorage.getItem("token");
      const res = await fetch("https://products-api.cbc-apps.net/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json();
      setOfferImage(data.url);
    } catch (e) {
      console.error(e);
    }
  };

  const deleteImg = () => setOfferImage("");

  const addOffer = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch("https://products-api.cbc-apps.net/offers/general", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: offerImage }),
      });
      cancelModal();
      if (onSubmit) onSubmit();
    } catch (e) {
      console.error(e);
    }
  };

  const onModalContentClick = (e) => e.stopPropagation();

  return (
    <>
      <button
        onClick={showModal}
        className="px-4 py-2 bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#F97316]/25 transition-all flex items-center gap-2"
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
            d="M12 4v16m8-8H4"
          />
        </svg>
        اضافة عرض
      </button>

      {openModal && (
        <div
          dir="rtl"
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 fade-modal-enter-to"
          onClick={cancelModal}
          style={{
            animation: "fadeIn 0.4s ease-out forwards",
          }}
        >
          <div
            className="bg-[#1A1A1A] rounded-2xl h-[90%] w-full border border-white/5 shadow-2xl modal-content-enter-active max-w-lg"
            onClick={onModalContentClick}
            style={{
              animation:
                "modalBounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards",
            }}
          >
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

            <div className="p-6 space-y-4">
              {!offerImage ? (
                <label
                  className="cursor-pointer rounded-lg shadow-sm w-full"
                  htmlFor="file-upload"
                >
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={(e) => uploadImg(e.target.files[0])}
                  />
                  <div className="relative h-48 w-full border-2 border-dashed border-gray-300 hover:border-blue-500 bg-gray-50 hover:bg-blue-50 rounded-xl flex items-center justify-center text-center transition duration-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
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
                    <svg
                      className="w-4 h-4"
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
              )}
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
                Cancel
              </button>
            </div>
          </div>

          <style>{`
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