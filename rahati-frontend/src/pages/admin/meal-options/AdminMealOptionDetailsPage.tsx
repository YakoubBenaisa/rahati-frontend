import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MainLayout } from '../../../layouts';
import { Card, Button, Alert, Spinner, Badge } from '../../../components/ui';
//import { useAuth } from '../../../hooks';
import { motion } from 'framer-motion';
import { mealOptionsAPI } from '../../../services/api';
import { MealOption } from '../../../types';
import { formatDate } from '../../../utils/dateUtils';

const AdminMealOptionDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [mealOption, setMealOption] = useState<MealOption | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  // Fetch meal option data
  useEffect(() => {
    const fetchMealOption = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await mealOptionsAPI.getMealOptionById(Number(id));
        const data = response.data.data || response.data;
        setMealOption(data);
      } catch (err) {
        console.error('Error fetching meal option:', err);
        setError('Failed to load meal option. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchMealOption();
    }
  }, [id]);

  // Handle delete meal option
  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    
    try {
      await mealOptionsAPI.deleteMealOption(Number(id));
      navigate('/admin/meal-options', { state: { message: 'Meal option deleted successfully' } });
    } catch (err) {
      console.error('Error deleting meal option:', err);
      setError('Failed to delete meal option. Please try again.');
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-12">
            <Spinner size="lg" />
            <span className="ml-3 text-[var(--color-text-secondary)]">Loading meal option...</span>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!mealOption && !isLoading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Alert
            variant="error"
            message="Meal option not found."
            className="mb-6"
          />
          <Button
            onClick={() => navigate('/admin/meal-options')}
            variant="primary"
          >
            Back to Meal Options
          </Button>
        </div>
      </MainLayout>
    );
  }

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
              <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Meal Option Details</h1>
              <p className="mt-2 text-[var(--color-text-secondary)]">
                View detailed information about this meal option.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Button
                onClick={() => navigate('/admin/meal-options')}
                variant="outline"
                leftIcon={
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                }
              >
                Back
              </Button>
              <Button
                onClick={() => navigate(`/admin/meal-options/${id}/edit`)}
                variant="outline"
                leftIcon={
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                }
              >
                Edit
              </Button>
              <Button
                onClick={() => setShowDeleteConfirm(true)}
                variant="danger"
                leftIcon={
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                }
              >
                Delete
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

        {showDeleteConfirm && (
          <>
            <Alert
              variant="warning"
              message="Are you sure you want to delete this meal option? This action cannot be undone."
              className="mb-6"
            />
            <div className="flex space-x-3 mt-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="danger"
                isLoading={isDeleting}
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </>
        )}

        {mealOption && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">{mealOption.name}</h2>
                    <div className="mt-2 flex items-center">
                      <Badge 
                      //variant={mealOption.is_active ? 'active' : 'inactive'}
                      >
                        {mealOption.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <span className="ml-4 text-[var(--color-text-secondary)]">
                        Price: ${mealOption.price}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {mealOption.is_vegetarian && (
                      <Badge variant="success" size="sm">Vegetarian</Badge>
                    )}
                    {mealOption.is_vegan && (
                      <Badge variant="success" size="sm">Vegan</Badge>
                    )}
                    {mealOption.is_gluten_free && (
                      <Badge variant="success" size="sm">Gluten-Free</Badge>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-[var(--color-text-primary)]">Description</h3>
                  <p className="mt-2 text-[var(--color-text-secondary)]">{mealOption.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[var(--color-border)]">
                  <div>
                    <h3 className="text-sm font-medium text-[var(--color-text-tertiary)]">Created At</h3>
                    <p className="mt-1 text-[var(--color-text-secondary)]">
                      {mealOption.created_at ? formatDate(mealOption.created_at) : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-[var(--color-text-tertiary)]">Last Updated</h3>
                    <p className="mt-1 text-[var(--color-text-secondary)]">
                      {mealOption.updated_at ? formatDate(mealOption.updated_at) : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
};

export default AdminMealOptionDetailsPage;
