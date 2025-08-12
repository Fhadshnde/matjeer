import React, { useEffect, useState } from "react";
import { FaBox, FaChartBar, FaShoppingCart, FaStar } from "react-icons/fa";
const DashboardStats = () => {
  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    async function fetchStatistics() {
      const dummyData = {
        products: { total: 123 },
        reviews: { totalReviews: 456 },
        orders: { total: 789 },
        sales: {
          totalSales: 10000,
          topSellingCategories: [
            { totalSales: 5000, orderCount: 200, categoryName: "إلكترونيات" },
            { totalSales: 3000, orderCount: 150, categoryName: "ملابس" },
            { totalSales: 2000, orderCount: 100, categoryName: "كتب" },
          ],
          topSellingProducts: [
            {
              productName: "هاتف ذكي",
              totalSales: 3000,
              quantitySold: 100,
              averageRating: 4.5,
            },
            {
              productName: "لابتوب",
              totalSales: 4000,
              quantitySold: 80,
              averageRating: 4.8,
            },
            {
              productName: "سماعات",
              totalSales: 1500,
              quantitySold: 50,
              averageRating: 4.3,
            },
          ],
        },
      };

      setTimeout(() => setStatistics(dummyData), 500);
    }
    fetchStatistics();
  }, []);

  if (!statistics) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
        <p className="text-white text-xl ml-4">جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen p-8 text-gray-100 font-sans" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="مجموع المنتجات"
            value={statistics.products.total}
            icon={<FaBox />}
            color="from-indigo-500 to-purple-600"
          />
          <StatCard
            title="إجمالي المبيعات"
            value={`$${statistics.sales.totalSales}`}
            icon={<FaChartBar />}
            color="from-green-500 to-teal-600"
          />
          <StatCard
            title="الطلبات"
            value={statistics.orders.total}
            icon={<FaShoppingCart />}
            color="from-yellow-500 to-orange-600"
          />
          <StatCard
            title="التقييمات"
            value={statistics.reviews.totalReviews}
            icon={<FaStar />}
            color="from-blue-500 to-cyan-600"
          />
        </div>

        {/* Top Selling Categories */}
        <div>
          <h2 className="text-3xl font-bold text-center text-white mb-6">
            🏆 الفئات الأكثر مبيعاً
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {statistics.sales.topSellingCategories.map((cat, index) => (
              <CategoryCard key={index} category={cat} rank={index + 1} />
            ))}
          </div>
        </div>

        {/* Top Selling Products */}
        <div>
          <h2 className="text-3xl font-bold text-center text-white mb-6">
            🎯 المنتجات الأكثر مبيعاً
          </h2>
          <div className="bg-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
            {statistics.sales.topSellingProducts.map((prod, index) => (
              <ProductRow key={index} product={prod} rank={index + 1} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable StatCard Component
const StatCard = ({ title, value, icon, color }) => (
  <div
    className={`relative p-6 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 bg-gradient-to-br ${color} overflow-hidden`}
  >
    <div className="absolute inset-0 bg-black opacity-10 rounded-2xl"></div>
    <div className="flex justify-between items-start relative z-10">
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-gray-200">{title}</span>
        <span className="mt-2 text-4xl font-extrabold text-white">{value}</span>
      </div>
      <div className="text-4xl text-white opacity-50">{icon}</div>
    </div>
  </div>
);

// Reusable CategoryCard Component
const CategoryCard = ({ category, rank }) => {
  const rankColors = {
    1: "bg-yellow-400 text-yellow-900",
    2: "bg-gray-400 text-gray-900",
    3: "bg-yellow-700 text-white",
  };

  const getEmoji = (rank) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return "";
    }
  };

  return (
    <div
      className={`relative p-6 rounded-2xl shadow-lg bg-gray-800 transition-transform duration-300 hover:scale-105 hover:bg-gray-700`}
    >
      <div
        className={`absolute top-4 right-4 p-2 rounded-full font-bold text-lg ${rankColors[rank]}`}
      >
        {getEmoji(rank)}
      </div>
      <div className="flex flex-col items-start space-y-4 pt-10">
        <h3 className="text-2xl font-bold text-white">{category.categoryName}</h3>
        <div className="flex justify-between w-full text-gray-300">
          <div className="text-center">
            <span className="block text-xl font-bold text-green-400">${category.totalSales}</span>
            <span className="text-sm">إجمالي المبيعات</span>
          </div>
          <div className="text-center">
            <span className="block text-xl font-bold text-blue-400">{category.orderCount}</span>
            <span className="text-sm">الطلبات</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable ProductRow Component
const ProductRow = ({ product, rank }) => {
  const isFirst = rank === 1;
  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-5 gap-4 items-center p-4 rounded-xl transition-transform duration-300 hover:scale-[1.02] cursor-pointer ${
        isFirst ? "bg-yellow-500/20 ring-2 ring-yellow-400" : "bg-gray-700 hover:bg-gray-600"
      }`}
    >
      <div className="font-bold text-xl text-white">#{rank}</div>
      <div className="col-span-1 sm:col-span-1">
        <span className="sm:hidden font-semibold text-gray-400">المنتج: </span>
        <span className="text-white">{product.productName}</span>
      </div>
      <div className="col-span-1 sm:col-span-1">
        <span className="sm:hidden font-semibold text-gray-400">المبيعات: </span>
        <span className="text-green-400 font-bold">${product.totalSales}</span>
      </div>
      <div className="col-span-1 sm:col-span-1">
        <span className="sm:hidden font-semibold text-gray-400">الكمية: </span>
        <span className="text-white">{product.quantitySold}</span>
      </div>
      <div className="col-span-1 sm:col-span-1 flex items-center">
        <span className="sm:hidden font-semibold text-gray-400">التقييم: </span>
        <span className="text-yellow-400">{product.averageRating.toFixed(1)}</span>
        <FaStar className="ml-1 text-yellow-400" />
      </div>
    </div>
  );
};

export default DashboardStats;