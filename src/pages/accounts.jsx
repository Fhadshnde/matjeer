import React, { useState, useEffect, useMemo, useRef } from 'react';
import AddAccountModal from './AddAccountModal'; // Assuming you have a component for the modal

// This CSS can be put in a separate file, e.g., 'Accounts.css'
// or included directly in a style tag.
const styles = `
.user-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.user-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

@keyframes pulse-dot {
  0% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
}
`;

const roleClasses = {
  admin: 'bg-gradient-to-r from-[#5E54F2] to-[#7C3AED] text-white',
  manager: 'bg-[#F97316]/20 text-[#F97316]',
  supervisor: 'bg-[#3B82F6]/20 text-[#3B82F6]',
  operator: 'bg-[#10B981]/20 text-[#10B981]',
  viewer: 'bg-[#94A3B8]/20 text-[#94A3B8]',
};

const userInitialData = [
  {
    id: 1,
    name: 'Ahmed Hassan',
    email: 'ahmed.hassan@warehouse.com',
    role: 'admin',
    department: 'Management',
    status: 'active',
    isOnline: true,
    lastActive: '2 min ago',
    avatarColor: 'bg-gradient-to-br from-[#5E54F2] to-[#7C3AED]',
    permissions: ['Full Access', 'Billing', 'Reports'],
  },
  {
    id: 2,
    name: 'Sara Ali',
    email: 'sara.ali@warehouse.com',
    role: 'manager',
    department: 'Operations',
    status: 'active',
    isOnline: true,
    lastActive: '15 min ago',
    avatarColor: 'bg-gradient-to-br from-[#F97316] to-[#EA580C]',
    permissions: ['Orders', 'Products', 'Reports'],
  },
  {
    id: 3,
    name: 'Khalid Omar',
    email: 'khalid.omar@warehouse.com',
    role: 'supervisor',
    department: 'Inventory',
    status: 'active',
    isOnline: false,
    lastActive: '1 hour ago',
    avatarColor: 'bg-gradient-to-br from-[#10B981] to-[#059669]',
    permissions: ['Products', 'Categories', 'View Orders'],
  },
  {
    id: 4,
    name: 'Fatima Noor',
    email: 'fatima.noor@warehouse.com',
    role: 'operator',
    department: 'Shipping',
    status: 'active',
    isOnline: true,
    lastActive: '5 min ago',
    avatarColor: 'bg-gradient-to-br from-[#3B82F6] to-[#2563EB]',
    permissions: ['Orders', 'Shipping'],
  },
  {
    id: 5,
    name: 'Ali Mohammed',
    email: 'ali.mohammed@warehouse.com',
    role: 'viewer',
    department: 'Finance',
    status: 'inactive',
    isOnline: false,
    lastActive: '3 days ago',
    avatarColor: 'bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED]',
    permissions: ['View Reports', 'View Orders'],
  },
];

const roleFiltersData = [
  { id: 'all', name: 'All Roles', count: 156 },
  { id: 'admin', name: 'Admin', count: 8 },
  { id: 'manager', name: 'Manager', count: 24 },
  { id: 'supervisor', name: 'Supervisor', count: 36 },
  { id: 'operator', name: 'Operator', count: 72 },
  { id: 'viewer', name: 'Viewer', count: 16 },
];

const AccountsManagement = () => {
  const [activeRole, setActiveRole] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openUserMenu, setOpenUserMenu] = useState(null);
  const dropdownRef = useRef(null);

  const toggleUserMenu = (userId) => {
    setOpenUserMenu(openUserMenu === userId ? null : userId);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenUserMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const filteredUsers = useMemo(() => {
    let filtered = userInitialData;

    if (activeRole !== 'all') {
      filtered = filtered.filter((user) => user.role === activeRole);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((user) => user.status === statusFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.department.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [activeRole, statusFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      <style>{styles}</style>

      {/* Header */}
      <div className="bg-[#1A1A1A]/80 border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Accounts Management</h1>
              <p className="text-sm text-[#94A3B8] mt-1">Manage users, roles, and permissions</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-medium rounded-lg transition-all flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Invite User
              </button>
              {/* <AddAccountModal /> */}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#5E54F2]/20 to-[#7C3AED]/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-[#5E54F2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              </div>
            </div>
            <h3 className="text-[#94A3B8] text-sm">Total Users</h3>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-2xl font-bold text-white">156</p>
              <span className="text-xs text-[#10B981]">+12 this month</span>
            </div>
          </div>

          <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#10B981]/20 to-[#059669]/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
            </div>
            <h3 className="text-[#94A3B8] text-sm">Active Now</h3>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-2xl font-bold text-white">23</p>
              <div className="flex -space-x-2">
                <div className="w-6 h-6 bg-gradient-to-br from-[#5E54F2] to-[#7C3AED] rounded-full border-2 border-[#1A1A1A]"></div>
                <div className="w-6 h-6 bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-full border-2 border-[#1A1A1A]"></div>
                <div className="w-6 h-6 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full border-2 border-[#1A1A1A]"></div>
                <div className="w-6 h-6 bg-[#94A3B8] rounded-full border-2 border-[#1A1A1A] flex items-center justify-center">
                  <span className="text-[8px] text-white font-semibold">+20</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#F97316]/20 to-[#EA580C]/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              </div>
            </div>
            <h3 className="text-[#94A3B8] text-sm">Pending Invites</h3>
            <p className="text-2xl font-bold text-[#F97316] mt-1">8</p>
          </div>

          <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#3B82F6]/20 to-[#2563EB]/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                </svg>
              </div>
            </div>
            <h3 className="text-[#94A3B8] text-sm">Roles</h3>
            <p className="text-2xl font-bold text-white mt-1">5</p>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto">
              {roleFiltersData.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setActiveRole(role.id)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                    activeRole === role.id ? 'bg-[#5E54F2] text-white' : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {role.name}
                  {role.count && <span className="ml-2 text-xs">{role.count}</span>}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users..."
                  className="pl-10 pr-4 py-2 bg-[#0F0F0F] border border-white/10 rounded-lg text-white placeholder-[#94A3B8] focus:border-[#5E54F2] focus:outline-none w-64"
                />
                <svg className="absolute left-3 top-2.5 w-5 h-5 text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0118 0z"></path>
                </svg>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-[#0F0F0F] border border-white/10 rounded-lg text-white focus:border-[#5E54F2] focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="user-card bg-[#1A1A1A] border border-white/5 rounded-xl p-6 hover:border-[#5E54F2]/50 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {user.avatar ? (
                      <div className="w-14 h-14 rounded-full overflow-hidden">
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center font-semibold text-white text-lg ${user.avatarColor}`}>
                        {user.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                    )}
                    <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#1A1A1A] ${user.isOnline ? 'bg-[#10B981]' : 'bg-gray-500'}`}></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{user.name}</h3>
                    <p className="text-sm text-[#94A3B8]">{user.email}</p>
                  </div>
                </div>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => toggleUserMenu(user.id)}
                    className="p-2 text-[#94A3B8] hover:text-white hover:bg-white/5 rounded-lg transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                    </svg>
                  </button>
                  {openUserMenu === user.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#1A1A1A] border border-white/10 rounded-lg shadow-xl z-10">
                      <button className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/5 transition-colors">
                        View Profile
                      </button>
                      <button className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/5 transition-colors">
                        Edit Details
                      </button>
                      <button className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/5 transition-colors">
                        Change Role
                      </button>
                      <hr className="border-white/10" />
                      <button className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-white/5 transition-colors">
                        {user.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#94A3B8]">Role</span>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${roleClasses[user.role]}`}>
                    {user.role}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#94A3B8]">Department</span>
                  <span className="text-sm text-white">{user.department}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#94A3B8]">Last Active</span>
                  <span className="text-sm text-white">{user.lastActive}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <p className="text-xs text-[#94A3B8] mb-2">Quick Permissions</p>
                <div className="flex flex-wrap gap-2">
                  {user.permissions.map((permission) => (
                    <span key={permission} className="px-2 py-1 text-xs bg-white/5 text-white rounded">
                      {permission}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <button className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-medium rounded-lg transition-all">
                  Message
                </button>
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-[#5E54F2] to-[#7C3AED] text-white font-medium rounded-lg hover:shadow-lg hover:shadow-[#5E54F2]/25 transition-all">
                  View Details
                </button>
              </div>
            </div>
          ))}

          <div className="user-card bg-[#1A1A1A] border-2 border-dashed border-white/10 rounded-xl hover:border-[#5E54F2]/50 transition-all cursor-pointer group">
            <div className="h-full flex flex-col items-center justify-center p-8 min-h-[400px]">
              <div className="w-16 h-16 bg-[#5E54F2]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#5E54F2]/20 transition-colors">
                <svg className="w-8 h-8 text-[#5E54F2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Add New User</h3>
              <p className="text-sm text-[#94A3B8] text-center">Create account and assign roles</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountsManagement;