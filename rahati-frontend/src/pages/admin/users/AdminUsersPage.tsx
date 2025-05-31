import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../../../layouts';
import { Card, Input, Badge, Select, Spinner, Alert } from '../../../components/ui';
import { useAuth } from '../../../hooks';
import { motion } from 'framer-motion';
import { usersAPI, centersAPI } from '../../../services/api';
import { User, Center } from '../../../types';
import { formatDate } from '../../../utils/dateUtils';
import { useAuthStore } from '../../../store';

const AdminUsersPage: React.FC = () => {
  const { user } = useAuth('Admin');
  const authStore = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState<string | null>(null);
  const [centers, setCenters] = useState<Center[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const itemsPerPage = 10;

  // Check if user can create new users
  const canCreateUsers = authStore.user?.role === 'Superuser' || authStore.user?.role === 'Admin';

  // No longer needed as we're using the Link component directly

  // Fetch centers for reference
  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const response = await centersAPI.getCenters();
        setCenters(response.data.data || response.data);
      } catch (err) {
        console.error('Error fetching centers:', err);
      }
    };

    fetchCenters();
  }, []);

  // Fetch users data from API
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // If user is an Admin (not Superuser), restrict to their center
        const params: any = {
          page: currentPage,
          per_page: itemsPerPage,
          role: roleFilter !== 'all' ? roleFilter : undefined
        };

        // Add center_id filter for Admin users (not Superuser)
        if (user?.role === 'Admin' && user?.center_id) {
          params.center_id = user.center_id;
        }

        const response = await usersAPI.getUsers(params);

        const data = response.data;
        const usersList = data.data || data;

        // Map API response to our User type
        const mappedUsers = usersList.map((apiUser: any) => ({
          ...apiUser,
          // Add any missing properties or transformations here
        }));

        setUsers(mappedUsers);
        setFilteredUsers(mappedUsers);

        // Handle pagination if available
        if (data.meta) {
          setTotalPages(data.meta.last_page);
          setTotalItems(data.meta.total);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, roleFilter, user]);

  // Filter users based on search term
  useEffect(() => {
    // Only filter by search term locally
    // Role filtering is handled by the API
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      const filtered = users.filter(
        user =>
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term)
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle role filter change - this will trigger a new API call
  const handleRoleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRoleFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when changing filters
  };

  // Get center name by ID
  const getCenterName = (centerId?: number) => {
    if (!centerId) return 'N/A';
    const center = centers.find(c => c.id === centerId);
    return center ? center.name : `Center #${centerId}`;
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Users</h1>
              <p className="mt-2 text-gray-600">
                Manage users of the platform.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              {canCreateUsers && (
                <Link to="/admin/users/new" className="inline-flex items-center justify-center font-medium rounded-md focus:outline-none transition-all duration-200 px-4 py-2 text-base bg-[var(--color-primary-600)] text-white hover:bg-[var(--color-primary-700)] focus:ring-2 focus:ring-[var(--color-primary-500)] focus:ring-offset-2">
                  <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add New User
                </Link>
              )}
            </div>
          </div>
        </motion.div>

        {error && (
          <Alert
            variant="error"
            message={error}
            onClose={() => setError(null)}
            className="mb-6"
          />
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card>
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="w-full md:w-2/3">
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  leftIcon={
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  }
                />
              </div>
              <div className="w-full md:w-1/3">
                <Select
                  value={roleFilter}
                  onChange={handleRoleFilterChange}
                  options={[
                    { value: 'all', label: 'All Roles' },
                    { value: 'Patient', label: 'Patient' },
                    { value: 'Provider', label: 'Provider' },
                    { value: 'Admin', label: 'Admin' },
                    { value: 'Superuser', label: 'Superuser' }
                  ]}
                />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              {totalItems > 0 ? (
                <span>
                  Showing {filteredUsers.length} of {totalItems} {totalItems === 1 ? 'user' : 'users'}
                </span>
              ) : (
                <span>
                  {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'} found
                </span>
              )}

              {user?.role === 'Admin' && user?.center_id && (
                <div className="mt-2 text-xs text-blue-600 bg-blue-50 p-2 rounded">
                  <svg className="inline-block h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  As an admin, you can only see users from your assigned center: {getCenterName(user.center_id)}
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Spinner size="lg" />
              <span className="ml-3 text-[var(--color-text-secondary)]">Loading users...</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || roleFilter !== 'all' ? 'Try adjusting your filters.' : 'Add a new user to get started.'}
                </p>
                {!searchTerm && roleFilter === 'all' && canCreateUsers && (
                  <div className="mt-6">
                    <Link to="/admin/users/new" className="inline-flex items-center justify-center font-medium rounded-md focus:outline-none transition-all duration-200 px-4 py-2 text-base bg-[var(--color-primary-600)] text-white hover:bg-[var(--color-primary-700)] focus:ring-2 focus:ring-[var(--color-primary-500)] focus:ring-offset-2">
                      Add New User
                    </Link>
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <div className="overflow-hidden bg-white shadow sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Center
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-lg font-semibold">
                            {user.name.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          variant={
                            user.role === 'Superuser' ? 'danger' :
                            user.role === 'Admin' ? 'primary' :
                            user.role === 'Provider' ? 'secondary' :
                            'info'
                          }
                        >
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getCenterName(user.center_id)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.phone || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.created_at ? formatDate(user.created_at) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link
                            to={`/admin/users/${user.id}`}
                            className="inline-flex items-center justify-center font-medium rounded-md focus:outline-none transition-all duration-200 px-3 py-1 text-sm border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-[var(--color-primary-500)] focus:ring-offset-2"
                          >
                            View
                          </Link>
                          <Link
                            to={`/admin/users/${user.id}/edit`}
                            className="inline-flex items-center justify-center font-medium rounded-md focus:outline-none transition-all duration-200 px-3 py-1 text-sm bg-[var(--color-primary-600)] text-white hover:bg-[var(--color-primary-700)] focus:ring-2 focus:ring-[var(--color-primary-500)] focus:ring-offset-2"
                          >
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {totalPages > 1 && (
                <div className="py-4 px-6 flex justify-center">
                  <div className="flex space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        className={`inline-flex items-center justify-center font-medium rounded-md focus:outline-none transition-all duration-200 px-3 py-1 text-sm ${
                          currentPage === page
                            ? 'bg-[var(--color-primary-600)] text-white hover:bg-[var(--color-primary-700)]'
                            : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                        } focus:ring-2 focus:ring-[var(--color-primary-500)] focus:ring-offset-2`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default AdminUsersPage;
