import React, { useState, useEffect, useMemo } from 'react';
// Assuming you have these modal components created
import AddOrderModal from './AddOrderModal';
import OrderDetailsModal from './OrderDetailsModal'; // Placeholder for view order
import { useNavigate } from 'react-router-dom';

const OrdersManagement = () => {
  // Replace Vue's ref with React's useState
  const [statistics, setStatistics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [activeStatus, setActiveStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);

  // Vue's definePageMeta is for Nuxt. In React, you'd handle this with a router or a parent component.
  // const navigate = useNavigate();
  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (!token) {
  //     navigate('/login');
  //   }
  // }, [navigate]);

  // Status tabs data
  const statusTabs = [
    { id: "all", name: "All Orders", color: "bg-gray-500" },
    { id: "PENDING", name: "Pending", color: "bg-[#F97316]" },
    { id: "PROCESSING", name: "Processing", color: "bg-[#3B82F6]" },
    { id: "DELIVERING", name: "Delivering", color: "bg-[#8B5CF6]" },
    { id: "DELIVERED", name: "Delivered", color: "bg-[#10B981]" },
    { id: "CANCELLED", name: "Cancelled", color: "bg-red-500" },
  ];

  // Helper function to fetch statistics
  const fetchStatisticsFunc = async () => {
    // Implement your statistics fetching logic here
    // For now, returning a mock object
    return {
      orders: {
        total: 250,
        pending: 30,
        processing: 50,
        delivering: 20,
        delivered: 100,
        cancelled: 50,
      },
    };
  };

  // Function to fetch orders
  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch("https://products-api.cbc-apps.net/orders/admin/all", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setOrders(data);
    } catch (e) {
      console.error("Error fetching orders:", e);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    const initData = async () => {
      setStatistics(await fetchStatisticsFunc());
      await fetchOrders();
    };
    initData();
  }, []);

  // Methods
  const getStatusClass = (status) => {
    const classes = {
      PENDING: "bg-[#F97316]/20 text-[#F97316]",
      PROCESSING: "bg-[#3B82F6]/20 text-[#3B82F6]",
      DELIVERING: "bg-[#8B5CF6]/20 text-[#8B5CF6]",
      DELIVERED: "bg-[#10B981]/20 text-[#10B981]",
      CANCELLED: "bg-red-500/20 text-red-500",
    };
    return classes[status] || "";
  };

  const toggleDropdown = (orderId) => {
    setOpenDropdown(openDropdown === orderId ? null : orderId);
  };

  const cancelOrder = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`https://products-api.cbc-apps.net/orders/${id}/cancel`, {
        method: 'PATCH',
        headers: {
          authorization: `Bearer ${token}`
        }
      });
      fetchOrders();
    } catch (e) {
      console.error(e);
    }
  };

  const delivering = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`https://products-api.cbc-apps.net/orders/${id}/deliver`, {
        method: 'PATCH',
        headers: {
          authorization: `Bearer ${token}`
        }
      });
      fetchOrders();
    } catch (e) {
      console.error(e);
    }
  };

  // Use useMemo for computed properties
  const filteredOrders = useMemo(() => {
    let filtered = orders;
    // Filter by status
    if (activeStatus !== "all") {
      filtered = filtered.filter(order => order.status === activeStatus);
    }
    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  }, [orders, activeStatus, searchQuery]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && !event.target.closest(".relative")) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      {/* Header */}
      <div className="bg-[#1A1A1A]/80 border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Orders Management</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#5E54F2]/20 to-[#7C3AED]/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-[#5E54F2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
              </div>
              <span className="text-xs text-[#10B981] font-medium">+12%</span>
            </div>
            <p className="text-xs text-[#94A3B8]">Total Orders</p>
            <p className="text-xl font-bold text-white">{statistics?.orders.total}</p>
          </div>
          {/* Other stats cards would go here */}
        </div>
      </div>

      {/* Filters & Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Status Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto">
              {statusTabs.map((status) => (
                <button
                  key={status.id}
                  onClick={() => setActiveStatus(status.id)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                    activeStatus === status.id ? 'bg-[#5E54F2] text-white' : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${status.color}`}></span>
                  {status.name}
                  {status.count && <span className="text-xs">{status.count}</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-[#1A1A1A] border border-white/5 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0F0F0F]/50 border-b border-white/5">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input type="checkbox" className="w-4 h-4 bg-[#0F0F0F] border-white/10 rounded text-[#5E54F2]" />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Items</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Total</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <input type="checkbox" className="w-4 h-4 bg-[#0F0F0F] border-white/10 rounded text-[#5E54F2]" />
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-white">#{order.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-white">{order.customer}</p>
                        <p className="text-xs text-[#94A3B8]">{order.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-white">{order.createdAt}</p>
                        <p className="text-xs text-[#94A3B8]">{order.time}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-white">{order.items.length}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-white">${order.total}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          order.payment === 'Paid' ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-[#F97316]/20 text-[#F97316]'
                        }`}
                      >
                        {order.payment}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="relative">
                          <button
                            onClick={() => toggleDropdown(order.id)}
                            className="p-2 text-[#94A3B8] hover:text-white hover:bg-white/5 rounded-lg transition-all"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                            </svg>
                          </button>
                          {/* Dropdown Menu */}
                          {openDropdown === order.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-[#1A1A1A] border border-white/10 rounded-lg shadow-xl z-10">
                              <button className="w-full px-4 py-2 text-left text-sm bg-[#3B82F6]/20 text-white hover:bg-white/5 transition-colors">
                                PROCESSING
                              </button>
                              <button onClick={() => delivering(order.id)} className="w-full px-4 py-2 text-left text-sm bg-[#8B5CF6]/20 text-white hover:bg-white/5 transition-colors">
                                Delivering
                              </button>
                              <button className="w-full px-4 py-2 text-left text-sm bg-[#10B981]/20 text-white hover:bg-white/5 transition-colors">
                                Delivered
                              </button>
                              <hr className="border-white/10" />
                              <button onClick={() => cancelOrder(order.id)} className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-white/5 transition-colors">
                                Cancel Order
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersManagement;