import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MainLayout } from '../../../layouts';
import { Card, Button, Input, Badge, Select, Alert } from '../../../components/ui';
import { useCenterStore } from '../../../store/centerStore';
import { motion } from 'framer-motion';
import { Center } from '../../../types';
import { useAuthStore } from '../../../store';

const AdminCentersPage: React.FC = () => {
  const authStore = useAuthStore();
  const navigate = useNavigate();
  const { centers, fetchCenters, isLoading } = useCenterStore();
  const [filteredCenters, setFilteredCenters] = useState<Center[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [accessError, setAccessError] = useState<string | null>(null);

  // Check if user has permission to access this page
  const isSuperuser = authStore.user?.role === 'Superuser';

  // Redirect to dashboard if not a superuser
  useEffect(() => {
    if (!isSuperuser) {
      setAccessError('You do not have permission to access the Centers management page. Only Superusers can manage healthcare centers.');
      // Redirect after showing the error message
      const timer = setTimeout(() => {
        navigate('/admin/dashboard');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isSuperuser, navigate]);

  // Fetch centers data
  useEffect(() => {
    fetchCenters();
  }, [fetchCenters]);

  // Filter centers based on search term and status
  useEffect(() => {
    let filtered = centers;

    // Filter by status
    if (statusFilter !== 'all') {
      const isActive = statusFilter === 'active';
      filtered = filtered.filter(center => center.is_active === isActive);
    }

    // Filter by search term
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        center =>
          center.name.toLowerCase().includes(term) ||
          center.description.toLowerCase().includes(term) ||
          center.address.toLowerCase().includes(term)
      );
    }

    setFilteredCenters(filtered);
  }, [searchTerm, statusFilter, centers]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
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
              <h1 className="text-3xl font-bold text-gray-900">Healthcare Centers</h1>
              <p className="mt-2 text-gray-600">
                Manage healthcare centers on the platform.
              </p>
            </div>
            {isSuperuser && (
              <div className="mt-4 md:mt-0">
                <Button
                  as={Link}
                  to="/admin/centers/new"
                  variant="primary"
                  leftIcon={
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  }
                >
                  Add New Center
                </Button>
              </div>
            )}
          </div>
        </motion.div>

        {accessError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Alert
              variant="error"
              message={accessError}
              className="mb-6"
            />
          </motion.div>
        )}

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
                  placeholder="Search by name, description, or address..."
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
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  options={[
                    { value: 'all', label: 'All Statuses' },
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' }
                  ]}
                />
              </div>
              <div className="text-sm text-gray-500">
                {filteredCenters.length} {filteredCenters.length === 1 ? 'center' : 'centers'} found
              </div>
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
          ) : filteredCenters.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No centers found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || statusFilter !== 'all' ? 'Try adjusting your filters.' : 'Add a new healthcare center to get started.'}
                </p>
                {!searchTerm && statusFilter === 'all' && isSuperuser && (
                  <div className="mt-6">
                    <Button
                      as={Link}
                      to="/admin/centers/new"
                      variant="primary"
                    >
                      Add New Center
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCenters.map((center) => (
                <Card key={center.id} className="h-full hover:shadow-lg transition-shadow duration-300">
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <Badge variant={center.is_active ? 'success' : 'danger'}>
                        {center.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>

                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      {center.name}
                    </h3>

                    <p className="text-gray-600 mb-2 line-clamp-2">
                      {center.description}
                    </p>

                    <p className="text-gray-600 mb-2">
                      <span className="font-medium">Address:</span> {center.address}
                    </p>

                    <p className="text-gray-600 mb-4">
                      <span className="font-medium">Contact:</span> {center.phone}
                    </p>

                    <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between">
                      <Button
                        as={Link}
                        to={`/admin/centers/${center.id}`}
                        variant="outline"
                        size="sm"
                      >
                        View Details
                      </Button>

                      <Button
                        as={Link}
                        to={`/admin/centers/${center.id}/edit`}
                        variant="primary"
                        size="sm"
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default AdminCentersPage;
