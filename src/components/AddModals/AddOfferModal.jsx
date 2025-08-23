import { useState, useRef, useEffect } from "react";

export default function AddOfferModal({ onSubmit }) {
  const [openModal, setOpenModal] = useState(false);
  const [offerImage, setOfferImage] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://products-api.cbc-apps.net/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setProductsList(Array.isArray(data) ? data : data.products || []);
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
    fetchProducts();
    fetchCategories();
    fetchSections();
  }, []);

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
      const token = localStorage.getItem("token");
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
    if (selectedProductIds.length === 0) return;
    if (!selectedCategoryId || !selectedSectionId) return;

    const selectedProducts = productsList.filter((p) =>
      selectedProductIds.includes(p.id)
    );
    const discountPercentage = 20;

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
        discountPercentage,
      })),
    };

    try {
      const token = localStorage.getItem("token");
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
        اضافة عرض
      </button>

      {openModal && (
        <div
          dir="rtl"
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={cancelModal}
          style={{ animation: "fadeIn 0.4s ease-out forwards" }}
        >
          <div
            className="bg-[#1A1A1A] rounded-2xl h-[90%] w-full border border-white/5 shadow-2xl max-w-lg overflow-y-auto"
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
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="عنوان العرض"
                className="w-full px-3 py-2 rounded-lg border bg-gray-50"
              />

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="وصف العرض"
                className="w-full px-3 py-2 rounded-lg border bg-gray-50"
              />

              <div className="flex gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border bg-gray-50"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border bg-gray-50"
                />
              </div>

              <label className="flex items-center gap-2 text-white">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                تفعيل العرض
              </label>

              <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border bg-gray-50"
              >
                <option value="">اختر الفئة</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <select
                value={selectedSectionId}
                onChange={(e) => setSelectedSectionId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border bg-gray-50"
              >
                <option value="">اختر القسم</option>
                {sections.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
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
                    رفع صورة العرض
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
                    ×
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

          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; backdrop-filter: blur(0px); }
              to { opacity: 1; backdrop-filter: blur(8px); background-color: rgba(0,0,0,0.6); }
            }
            @keyframes modalBounceIn {
              0% { opacity: 0; transform: scale(0.3) translateY(-100px) rotate(-10deg); }
              50% { transform: scale(1.05) translateY(10px) rotate(2deg); }
              100% { opacity: 1; transform: scale(1) translateY(0) rotate(0deg); }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
