import React, { useState } from "react";

export default function DeleteCategoryModal({ id, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);

  const showModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const deleteCategory = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://products-api.cbc-apps.net/categories/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to delete category");

      if (typeof onDelete === "function") onDelete();
      closeModal();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      {/* Delete Icon Button */}
      <svg
        onClick={showModal}
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        viewBox="0 0 24 24"
        style={{ cursor: "pointer" }}
        fill="currentColor"
      >
        <path d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z" />
      </svg>

      {/* Modal */}
      {isOpen && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(5px)",
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#1A1A1A",
              borderRadius: "1rem",
              maxWidth: "48rem",
              width: "100%",
              maxHeight: "90vh",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.05)",
              boxShadow:
                "0 10px 20px rgba(233,115,18,0.25), 0 0 10px rgba(233,115,18,0.1)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "1.5rem 1.5rem",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                background:
                  "linear-gradient(to right, #ea3b0a, #7C3AED)",
                borderTopLeftRadius: "1rem",
                borderTopRightRadius: "1rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                position: "sticky",
                top: 0,
                zIndex: 10,
              }}
            >
              <h3
                style={{
                  color: "white",
                  fontWeight: "700",
                  fontSize: "1.25rem",
                }}
              >
                Delete Category
              </h3>
              <button
                onClick={closeModal}
                style={{
                  color: "rgba(255,255,255,0.8)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
                aria-label="Close modal"
              >
                <svg
                  width={24}
                  height={24}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div
              style={{
                overflowY: "auto",
                maxHeight: "calc(90vh - 140px)",
                flexGrow: 1,
              }}
            ></div>

            {/* Footer */}
            <div
              style={{
                padding: "1.5rem",
                borderTop: "1px solid rgba(255,255,255,0.05)",
                backgroundColor: "#1A1A1A",
                borderBottomLeftRadius: "1rem",
                borderBottomRightRadius: "1rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                position: "sticky",
                bottom: 0,
                gap: "1rem",
              }}
            >
              <h1
                style={{
                  color: "#e8120f",
                  fontWeight: "700",
                  margin: 0,
                }}
              >
                * you cannot restore it
              </h1>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  onClick={closeModal}
                  type="button"
                  style={{
                    padding: "0.5rem 1.25rem",
                    cursor: "pointer",
                    color: "#94A3B8",
                    background: "transparent",
                    border: "none",
                    fontWeight: "500",
                    transition: "color 0.3s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#94A3B8")
                  }
                >
                  Cancel
                </button>
                <button
                  onClick={deleteCategory}
                  type="button"
                  style={{
                    padding: "0.5rem 1.5rem",
                    cursor: "pointer",
                    background:
                      "linear-gradient(to right, #F97316, #EA580C)",
                    color: "white",
                    fontWeight: "600",
                    borderRadius: "0.5rem",
                    boxShadow:
                      "0 10px 15px rgba(249,115,22,0.25), 0 0 8px rgba(249,115,22,0.15)",
                    transition: "box-shadow 0.3s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.boxShadow =
                      "0 15px 25px rgba(249,115,22,0.4), 0 0 12px rgba(249,115,22,0.25)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.boxShadow =
                      "0 10px 15px rgba(249,115,22,0.25), 0 0 8px rgba(249,115,22,0.15)")
                  }
                >
                  Delete Category
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
