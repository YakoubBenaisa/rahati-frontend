import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../../layouts';
import { Card, Button, Alert, Spinner, Badge, Table, Pagination } from '../../../components/ui';
import { useAuth } from '../../../hooks';
import { motion } from 'framer-motion';
import { mealOptionsAPI } from '../../../services/api';
import { MealOption } from '../../../types';

const AdminMealOptionsPage: React.FC = () => {
  const { user } = useAuth('Admin');
  const navigate = useNavigate();
  const [mealOptions, setMealOptions] = useState<MealOption[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const itemsPerPage = 10;

  // Fetch meal options
  useEffect(() => {
    const fetchMealOptions = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await mealOptionsAPI.getMealOptions({
          page: currentPage,
          per_page: itemsPerPage
        });
        
        const data = response.data;
        setMealOptions(data.data || data);
        
        // Handle pagination if available
        if (data.meta) {
          setTotalPages(data.meta.last_page);
          setTotalItems(data.meta.total);
        }
      } catch (err) {
        console.error('Error fetching meal options:', err);
        setError('Failed to load meal options. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMealOptions();
  }, [currentPage]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
              <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Meal Options</h1>
              <p className="mt-2 text-[var(--color-text-secondary)]">
                Manage meal options for patient accommodations.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button
                onClick={() => navigate('/admin/meal-options/new')}
                variant="primary"
                leftIcon={
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                }
              >
                Add Meal Option
              </Button>
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
        >
          <Card>
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Spinner size="lg" />
                <span className="ml-3 text-[var(--color-text-secondary)]">Loading meal options...</span>
              </div>
            ) : mealOptions.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-[var(--color-text-tertiary)]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-[var(--color-text-primary)]">No meal options found</h3>
                <p className="mt-1 text-[var(--color-text-secondary)]">Get started by adding a new meal option.</p>
                <div className="mt-6">
                  <Button
                    onClick={() => navigate('/admin/meal-options/new')}
                    variant="primary"
                  >
                    Add Meal Option
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <Table>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>ID</Table.HeaderCell>
                      <Table.HeaderCell>Name</Table.HeaderCell>
                      <Table.HeaderCell>Price</Table.HeaderCell>
                      <Table.HeaderCell>Dietary Options</Table.HeaderCell>
                      <Table.HeaderCell>Status</Table.HeaderCell>
                      <Table.HeaderCell>Actions</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {mealOptions.map((option) => (
                      <Table.Row key={option.id}>
                        <Table.Cell>{option.id}</Table.Cell>
                        <Table.Cell>{option.name}</Table.Cell>
                        <Table.Cell>${option.price}</Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-wrap gap-1">
                            {option.is_vegetarian && (
                              <Badge variant="success" size="sm">Vegetarian</Badge>
                            )}
                            {option.is_vegan && (
                              <Badge variant="success" size="sm">Vegan</Badge>
                            )}
                            {option.is_gluten_free && (
                              <Badge variant="success" size="sm">Gluten-Free</Badge>
                            )}
                          </div>
                        </Table.Cell>
                        <Table.Cell>
                          <Badge variant={option.is_active ? 'success' : 'error'}>
                            {option.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/admin/meal-options/${option.id}`)}
                            >
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/admin/meal-options/${option.id}/edit`)}
                            >
                              Edit
                            </Button>
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
                
                {totalPages > 1 && (
                  <div className="py-4 px-6 flex justify-center">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default AdminMealOptionsPage;
