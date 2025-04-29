import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../../../layouts';
import { Card, Button, Input, Badge, Select } from '../../../components/ui';
import { useAuth } from '../../../hooks';
import { motion } from 'framer-motion';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'Patient' | 'Provider' | 'Admin';
  status: 'active' | 'inactive';
  createdAt: string;
}

const AdminUsersPage: React.FC = () => {
  const { user } = useAuth('Admin');
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock fetch users data
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockUsers: User[] = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
          role: 'Patient',
          status: 'active',
          createdAt: '2023-01-15'
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          role: 'Provider',
          status: 'active',
          createdAt: '2023-02-20'
        },
        {
          id: 3,
          name: 'Robert Johnson',
          email: 'robert.johnson@example.com',
          role: 'Patient',
          status: 'inactive',
          createdAt: '2023-03-10'
        },
        {
          id: 4,
          name: 'Emily Davis',
          email: 'emily.davis@example.com',
          role: 'Provider',
          status: 'active',
          createdAt: '2023-04-05'
        },
        {
          id: 5,
          name: 'Michael Wilson',
          email: 'michael.wilson@example.com',
          role: 'Admin',
          status: 'active',
          createdAt: '2023-01-01'
        }
      ];
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter users based on search term, role, and status
  useEffect(() => {
    let filtered = users;
    
    // Filter by role
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }
    
    // Filter by search term
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        user =>
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term)
      );
    }
    
    setFilteredUsers(filtered);
  }, [searchTerm, roleFilter, statusFilter, users]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle role filter change
  const handleRoleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRoleFilter(e.target.value);
  };

  // Handle status filter change
  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
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
              <Button
                as={Link}
                to="/admin/users/new"
                variant="primary"
                leftIcon={
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                }
              >
                Add New User
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card>
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="w-full md:w-1/2">
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
              <div className="w-full md:w-1/4">
                <Select
                  value={roleFilter}
                  onChange={handleRoleFilterChange}
                  options={[
                    { value: 'all', label: 'All Roles' },
                    { value: 'Patient', label: 'Patient' },
                    { value: 'Provider', label: 'Provider' },
                    { value: 'Admin', label: 'Admin' }
                  ]}
                />
              </div>
              <div className="w-full md:w-1/4">
                <Select
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  options={[
                    { value: 'all', label: 'All Statuses' },
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' }
                  ]}
                />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'} found
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {isLoading ? (
            <div className="flex justify-center py-12">
              <svg className="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : filteredUsers.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || roleFilter !== 'all' || statusFilter !== 'all' ? 'Try adjusting your filters.' : 'Add a new user to get started.'}
                </p>
                {!searchTerm && roleFilter === 'all' && statusFilter === 'all' && (
                  <div className="mt-6">
                    <Button
                      as={Link}
                      to="/admin/users/new"
                      variant="primary"
                    >
                      Add New User
                    </Button>
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
                      Status
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
                            user.role === 'Admin' ? 'primary' :
                            user.role === 'Provider' ? 'secondary' :
                            'info'
                          }
                        >
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          variant={user.status === 'active' ? 'success' : 'danger'}
                        >
                          {user.status === 'active' ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button
                            as={Link}
                            to={`/admin/users/${user.id}`}
                            variant="outline"
                            size="sm"
                          >
                            View
                          </Button>
                          <Button
                            as={Link}
                            to={`/admin/users/${user.id}/edit`}
                            variant="primary"
                            size="sm"
                          >
                            Edit
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default AdminUsersPage;
