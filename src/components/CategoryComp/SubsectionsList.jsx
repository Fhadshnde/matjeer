import React, { useState, useEffect, useMemo } from "react";

export default function SubsectionsList({ activeTab }) {
  const [subSections, setSubSections] = useState([]);
  const [expandedSubsections, setExpandedSubsections] = useState([]);

  // جلب البيانات مرة واحدة عند تحميل الكومبوننت
  useEffect(() => {
    async function fetchSections() {
      try {
        const res = await fetch("http://31.97.35.42:4500/sections");
        const data = await res.json();
        setSubSections(data);
      } catch (err) {
        console.error("Failed to fetch sections:", err);
      }
    }
    fetchSections();
  }, []);

  // فلترة الأقسام حسب activeTab
  const filteredSubsections = useMemo(() => {
    if (!activeTab || activeTab === "all") return subSections;
    return subSections.filter((s) => s.status === activeTab);
  }, [activeTab, subSections]);

  // تبديل حالة التوسيع
  const toggleSubsection = (id) => {
    setExpandedSubsections((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  // حساب عدد المنتجات للقسم
  const productCount = (subSectionId) => {
    const sub = subSections.find((s) => s.id === subSectionId);
    return sub && Array.isArray(sub.products) ? sub.products.length : 0;
  };

  return (
    <div className="space-y-3">
      {filteredSubsections.map((subsection) => (
        <div key={subsection.id} className="subsection-item group">
          <div className="flex items-center justify-between p-4 bg-[#0F0F0F] rounded-lg hover:bg-[#0F0F0F]/70 transition-all">
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleSubsection(subsection.id)}
                className="p-1 hover:bg-white/5 rounded transition-all"
                aria-label="Toggle subsection"
              >
                <svg
                  className={`w-4 h-4 text-[#94A3B8] transform transition-transform ${
                    expandedSubsections.includes(subsection.id) ? "rotate-90" : ""
                  }`}
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
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${subsection.color}`}
              >
                <svg
                  className={`w-5 h-5 ${subsection.iconColor}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-white">{subsection.name}</h4>
                <p className="text-sm text-[#94A3B8]">
                  {subsection.description} • {productCount(subsection.id)} products
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  subsection.status === "active"
                    ? "bg-[#10B981]/20 text-[#10B981]"
                    : "bg-red-500/20 text-red-500"
                }`}
              >
                {subsection.status === "active" ? "Active" : "Inactive"}
              </span>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 text-[#94A3B8] hover:text-white hover:bg-white/5 rounded-lg transition-all" aria-label="Edit subsection">
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button className="p-2 text-[#94A3B8] hover:text-red-400 hover:bg-white/5 rounded-lg transition-all" aria-label="Delete subsection">
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Nested Items */}
          {expandedSubsections.includes(subsection.id) && (
            <div className="ml-12 mt-2 space-y-2">
              {subsection.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-[#0F0F0F]/50 rounded-lg hover:bg-[#0F0F0F]/70 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#5E54F2] rounded-full"></div>
                    <span className="text-sm text-white">{item.name}</span>
                    <span className="text-xs text-[#94A3B8]">
                      {item.productCount} products
                    </span>
                  </div>
                  <button className="text-xs text-[#F97316] hover:text-[#EA580C] font-medium">
                    View
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Add New Subsection */}
      <button className="w-full p-4 border-2 border-dashed border-white/10 rounded-lg hover:border-[#5E54F2]/50 hover:bg-[#5E54F2]/5 transition-all group">
        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-10 bg-[#5E54F2]/10 rounded-lg flex items-center justify-center group-hover:bg-[#5E54F2]/20 transition-colors">
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
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
          <span className="text-[#94A3B8] group-hover:text-white transition-colors">
            Add New Subsection
          </span>
        </div>
      </button>
    </div>
  );
}
