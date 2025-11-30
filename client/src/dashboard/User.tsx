import React, { useState, useEffect } from "react";
import { toast } from "sonner";

type UserRole = "USER" | "ADMIN";

interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

const Userpage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [emailFilter, setEmailFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "">("");
  const [dateFilter, setDateFilter] = useState("");
  const [timeFilter, setTimeFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [tempRole, setTempRole] = useState<UserRole | "">("");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, emailFilter, roleFilter, dateFilter, timeFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/user");

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data: User[] = await response.json();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError("Failed to load users");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...users];
    if (emailFilter) {
      filtered = filtered.filter((user) =>
        user.email.toLowerCase().includes(emailFilter.toLowerCase())
      );
    }
    if (roleFilter) {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }
    if (dateFilter) {
      filtered = filtered.filter((user) => {
        const userDate = new Date(user.createdAt).toLocaleDateString();
        const filterDate = new Date(dateFilter).toLocaleDateString();
        return userDate === filterDate;
      });
    }
    if (timeFilter === "12hours") {
      const twelveHoursAgo = new Date();
      twelveHoursAgo.setHours(twelveHoursAgo.getHours() - 12);

      filtered = filtered.filter((user) => {
        const userDate = new Date(user.createdAt);
        return userDate >= twelveHoursAgo;
      });
    }
    if (timeFilter === "today") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      filtered = filtered.filter((user) => {
        const userDate = new Date(user.createdAt);
        return userDate >= today && userDate < tomorrow;
      });
    }

    if (timeFilter === "7days") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      filtered = filtered.filter((user) => {
        const userDate = new Date(user.createdAt);
        return userDate >= sevenDaysAgo;
      });
    }

    setFilteredUsers(filtered);
  };

  const clearFilters = () => {
    setEmailFilter("");
    setRoleFilter("");
    setDateFilter("");
    setTimeFilter("");
    setShowFilters(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatDateMobile = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800";
      case "USER":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const startEditing = (user: User) => {
    setEditingUserId(user.id);
    setTempRole(user.role);
  };

  const cancelEditing = () => {
    setEditingUserId(null);
    setTempRole("");
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/user/${userId}/role`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: newRole }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user role");
      }

      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );

      toast.success("User role updated successfully!");
      setEditingUserId(null);
      setTempRole("");
    } catch (err) {
      console.error("Error updating user role:", err);
      setError("Failed to update user role");
      toast.error("Failed to update user role");
    }
  };

  const submitRoleChange = () => {
    if (editingUserId && tempRole) {
      handleRoleChange(editingUserId, tempRole as UserRole);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/user/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      setUsers(users.filter((user) => user.id !== userId));
      setSelectedUser(null);
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Failed to delete user");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-xl text-gray-600">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">
            User Management
          </h1>
          <p className="text-gray-600 text-center mt-2 text-sm sm:text-base">
            Manage system users and their roles
          </p>
        </div>
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span className="text-red-800 text-sm sm:text-base">{error}</span>
            <button
              onClick={fetchUsers}
              className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition-colors text-sm w-full sm:w-auto"
            >
              Retry
            </button>
          </div>
        )}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full bg-white border border-gray-300 rounded-lg p-3 flex items-center justify-between shadow-sm"
          >
            <span className="font-medium text-gray-700">Filters</span>
            <span
              className={`transform transition-transform ${
                showFilters ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </button>
        </div>
        <div
          className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4 ${
            showFilters ? "block" : "hidden lg:block"
          }`}
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Filters</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <div>
              <label
                htmlFor="email-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                User name
              </label>
              <input
                id="email-filter"
                type="text"
                placeholder="Filter by user name..."
                value={emailFilter}
                onChange={(e) => setEmailFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="role-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Role
              </label>
              <select
                id="role-filter"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as UserRole | "")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="">All roles</option>
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="date-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Registration Date
              </label>
              <input
                id="date-filter"
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="time-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Time Range
              </label>
              <select
                id="time-filter"
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="">All time</option>
                <option value="12hours">Last 12 hours</option>
                <option value="today">Today</option>
                <option value="7days">Last 7 days</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={clearFilters}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors text-sm flex-1"
            >
              Clear All Filters
            </button>
            <button
              onClick={() => setShowFilters(false)}
              className="lg:hidden bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm flex-1"
            >
              Apply Filters
            </button>
          </div>
        </div>
        <div className="bg-gray-100 rounded-lg p-3 mb-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <p className="text-gray-700 font-medium text-sm sm:text-base">
              Showing {filteredUsers.length} of {users.length} users
            </p>
            <div className="flex gap-1 text-xs flex-wrap">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                User: {users.filter((u) => u.role === "USER").length}
              </span>
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
                Admin: {users.filter((u) => u.role === "ADMIN").length}
              </span>
            </div>
          </div>
        </div>

        <div className="lg:hidden space-y-3 mb-6">
          {filteredUsers.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <p className="text-gray-500">
                No users found matching your filters
              </p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-xs">
                        {user.email[0].toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900 break-all">
                        {user.email}
                      </div>
                      <code className="text-xs text-gray-500 bg-gray-100 px-1 py-0.5 rounded">
                        {user.id.slice(0, 8)}...
                      </code>
                    </div>
                  </div>
                  {editingUserId === user.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={submitRoleChange}
                        className="bg-green-600 text-white p-1 rounded text-xs hover:bg-green-700 transition-colors"
                      >
                        ✓
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="bg-gray-600 text-white p-1 rounded text-xs hover:bg-gray-700 transition-colors"
                      >
                        ✗
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEditing(user)}
                      className="text-blue-600 hover:text-blue-800 text-xs transition-colors"
                    >
                      Edit
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <label className="text-gray-500 text-xs">Role</label>
                    {editingUserId === user.id ? (
                      <select
                        value={tempRole}
                        onChange={(e) =>
                          setTempRole(e.target.value as UserRole)
                        }
                        className="w-full mt-1 text-xs px-2 py-1 rounded border border-gray-300 focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    ) : (
                      <div className="mt-1">
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${getRoleBadgeColor(
                            user.role
                          )}`}
                        >
                          {user.role}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-gray-500 text-xs">Created</label>
                    <p className="mt-1 text-gray-900 text-xs">
                      {formatDateMobile(user.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between">
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="text-blue-600 hover:text-blue-800 text-xs transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="text-red-600 hover:text-red-800 text-xs transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Updated At
                  </th>
                 
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      No users found matching your filters
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <code className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {user.id.slice(0, 8)}...
                        </code>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-xs">
                              {user.email[0].toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {editingUserId === user.id ? (
                          <div className="flex items-center gap-2">
                            <select
                              value={tempRole}
                              onChange={(e) =>
                                setTempRole(e.target.value as UserRole)
                              }
                              className="text-xs px-2 py-1 rounded border border-gray-300 focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="USER">USER</option>
                          
                              <option value="ADMIN">ADMIN</option>
                            </select>
                            <button
                              onClick={submitRoleChange}
                              className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 transition-colors"
                            >
                              ✓
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="bg-gray-600 text-white px-2 py-1 rounded text-xs hover:bg-gray-700 transition-colors"
                            >
                              ✗
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getRoleBadgeColor(
                                user.role
                              )}`}
                            >
                              {user.role}
                            </span>
                            <button
                              onClick={() => startEditing(user)}
                              className="text-blue-600 hover:text-blue-800 text-xs transition-colors"
                            >
                              Edit
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.updatedAt)}
                      </td>
                     
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={fetchUsers}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base w-full sm:w-auto"
          >
            Refresh Data
          </button>
        </div>

        {selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 lg:hidden">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-sm">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    User Details
                  </h3>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <label className="text-xs text-gray-500">Email</label>
                  <p className="text-sm font-medium text-gray-900 break-all">
                    {selectedUser.email}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">User ID</label>
                  <p className="text-sm text-gray-900 break-all">
                    {selectedUser.id}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Role</label>
                  <p className="text-sm">
                    <span
                      className={`font-medium px-2 py-1 rounded-full text-xs ${getRoleBadgeColor(
                        selectedUser.role
                      )}`}
                    >
                      {selectedUser.role}
                    </span>
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500">Created</label>
                    <p className="text-sm text-gray-900">
                      {formatDate(selectedUser.createdAt)}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Updated</label>
                    <p className="text-sm text-gray-900">
                      {formatDate(selectedUser.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
                <button
                  onClick={() => {
                    startEditing(selectedUser);
                    setSelectedUser(null);
                  }}
                  className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
                >
                  Edit Role
                </button>
                <button
                  onClick={() => {
                    deleteUser(selectedUser.id);
                    setSelectedUser(null);
                  }}
                  className="px-3 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition-colors"
                >
                  Delete User
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Userpage;
