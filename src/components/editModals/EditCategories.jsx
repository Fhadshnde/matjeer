import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function EditCategoryModal({ categoryId, onSubmit }) {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState({
    name: "",
    description: "",
    image: "",
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !categoryId) return;

    async function fetchCategory() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`https://products-api.cbc-apps.net/categories/${categoryId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch category");
        const data = await res.json();
        setCategory({
          name: data.name || "",
          description: data.description || "",
          image: data.image || "",
        });
      } catch (e) {
        console.error(e);
      }
    }

    fetchCategory();
  }, [isOpen, categoryId]);

  const showModal = () => setIsOpen(true);

  const closeModal = () => {
    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setCategory({ name: "", description: "", image: "" });
  };

  const uploadImg = async (file) => {
    if (!file) return;
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("https://products-api.cbc-apps.net/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const result = await res.json();
      setCategory((c) => ({ ...c, image: result.url }));
    } catch (e) {
      console.error(e);
    }
  };

  const deleteImg = () => {
    setCategory((c) => ({ ...c, image: "" }));
  };

  const editCategory = async () => {
    try {
      const token = localStorage.getItem("token");
      const { name, description, image } = category;
      const body = { name, description, image };

      const res = await fetch(`https://products-api.cbc-apps.net/categories/${categoryId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to update category");

      if (onSubmit) onSubmit();
      closeModal();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <svg
        onClick={showModal}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        style={{ cursor: "pointer" }}
        aria-label="Open edit category modal"
      >
        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
          <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
        </g>
      </svg>

      {isOpen &&
        createPortal(
          <div
            dir="rtl"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) closeModal();
            }}
            role="dialog"
            aria-modal="true"
          >
            <div className="bg-[#1A1A1A] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-white/5 shadow-2xl animate-modalBounceIn">
              <div className="px-6 py-4 border-b border-white/5 bg-gradient-to-r from-[#5E54F2] to-[#7C3AED] rounded-t-2xl flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-bold text-white">تعديل القسم</h3>
                  {category.image && (
                    <img
                      src={category.image}
                      alt="Category"
                      className="w-12 h-12 object-cover rounded-full border-2 border-white"
                    />
                  )}
                </div>
                <button
                  onClick={closeModal}
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

              <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6 space-y-6">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    editCategory();
                  }}
                >
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-[#5E54F2]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Basic Information
                    </h4>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                          Category Name *
                        </label>
                        <input
                          type="text"
                          placeholder="Enter Category name"
                          required
                          value={category.name}
                          onChange={(e) => setCategory((c) => ({ ...c, name: e.target.value }))}
                          className="w-full px-4 py-2 bg-[#0F0F0F] border border-white/10 rounded-lg text-white placeholder-[#94A3B8] focus:border-[#5E54F2] focus:outline-none focus:ring-1 focus:ring-[#5E54F2]"
                        />
                      </div>

                      <div>
                        {!category.image ? (
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              ref={fileInputRef}
                              onChange={(e) => uploadImg(e.target.files[0])}
                            />
                            <div className="relative h-fit w-fit border-2 border-dashed border-gray-300 hover:border-blue-500 bg-gray-50 hover:bg-blue-50 rounded-xl flex items-center justify-center p-4 text-center transition duration-200">
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
                          <div className="w-fit h-fit">
                            <img
                              className="h-18 w-18 rounded-xl mx-auto block object-cover"
                              src={category.image}
                              alt="Category"
                            />
                            <button
                              type="button"
                              onClick={deleteImg}
                              className="bg-red-400 cursor-pointer w-18 rounded-b-xl mx-auto block mt-2 text-white"
                            >
                              delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                        Description
                      </label>
                      <textarea
                        rows="3"
                        placeholder="Enter Category description"
                        value={category.description}
                        onChange={(e) => setCategory((c) => ({ ...c, description: e.target.value }))}
                        className="w-full px-4 py-2 bg-[#0F0F0F] border border-white/10 rounded-lg text-white placeholder-[#94A3B8] focus:border-[#5E54F2] focus:outline-none focus:ring-1 focus:ring-[#5E54F2] resize-none"
                      />
                    </div>
                  </div>
                </form>
              </div>

              <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between bg-[#1A1A1A] rounded-b-2xl sticky bottom-0">
                <p className="text-xs text-[#94A3B8]">* Required fields</p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-5 py-2 text-[#94A3B8] hover:text-white transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editCategory}
                    className="px-6 py-2 bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#F97316]/25 transition-all"
                  >
                    تعديل القسم
                  </button>
                </div>
              </div>
            </div>
            <style jsx>{`
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
          </div>,
          document.body
        )}
    </>
  );
}