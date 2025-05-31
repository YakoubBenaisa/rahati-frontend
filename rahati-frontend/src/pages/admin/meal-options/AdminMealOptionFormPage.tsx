import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MainLayout } from '../../../layouts';
import { Card, Button, Input, Textarea, Alert, Switch, Spinner } from '../../../components/ui';
import { useAuth } from '../../../hooks';
import { motion } from 'framer-motion';
import { mealOptionsAPI } from '../../../services/api';
import { MealOption } from '../../../types';

const AdminMealOptionFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const { user } = useAuth('Admin');
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<Partial<MealOption>>({
    name: '',
    description: '',
    price: 0,
    is_vegetarian: false,
    is_vegan: false,
    is_gluten_free: false,
    is_active: true
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch meal option data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchMealOption = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
          const response = await mealOptionsAPI.getMealOptionById(Number(id));
          const data = response.data.data || response.data;
          
          setFormData({
            name: data.name,
            description: data.description,
            price: data.price,
            is_vegetarian: data.is_vegetarian,
            is_vegan: data.is_vegan,
            is_gluten_free: data.is_gluten_free,
            is_active: data.is_active
          });
        } catch (err) {
          console.error('Error fetching meal option:', err);
          setError('Failed to load meal option. Please try again.');
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchMealOption();
    }
  }, [id, isEditMode]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle switch changes
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  // Handle price input
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setFormData(prev => ({ ...prev, price: isNaN(value) ? 0 : value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Validate form data
      if (!formData.name?.trim()) {
        throw new Error('Name is required');
      }
      
      if (!formData.description?.trim()) {
        throw new Error('Description is required');
      }
      
      if (formData.price === undefined || formData.price < 0) {
        throw new Error('Price must be a positive number');
      }
      
      // Create or update meal option
      if (isEditMode) {
        await mealOptionsAPI.updateMealOption(Number(id), formData);
        setSuccess('Meal option updated successfully');
      } else {
        await mealOptionsAPI.createMealOption(formData);
        setSuccess('Meal option created successfully');
        
        // Reset form after successful creation
        if (!isEditMode) {
          setFormData({
            name: '',
            description: '',
            price: 0,
            is_vegetarian: false,
            is_vegan: false,
            is_gluten_free: false,
            is_active: true
          });
        }
      }
      
      // Navigate back to meal options list after a short delay
      setTimeout(() => {
        navigate('/admin/meal-options');
      }, 1500);
    } catch (err: any) {
      console.error('Error saving meal option:', err);
      setError(err.message || 'Failed to save meal option. Please try again.');
    } finally {
      setIsSaving(false);
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
              <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
                {isEditMode ? 'Edit Meal Option' : 'Create Meal Option'}
              </h1>
              <p className="mt-2 text-[var(--color-text-secondary)]">
                {isEditMode ? 'Update the details of an existing meal option.' : 'Add a new meal option to the system.'}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button
                onClick={() => navigate('/admin/meal-options')}
                variant="outline"
                leftIcon={
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                }
              >
                Back to Meal Options
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

        {success && (
          <Alert
            variant="success"
            message={success}
            onClose={() => setSuccess(null)}
            className="mb-6"
          />
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Input
                    label="Name"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter meal option name"
                  />
                </div>
                <div>
                  <Input
                    label="Price ($)"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price?.toString() || '0'}
                    onChange={handlePriceChange}
                    required
                    placeholder="Enter price"
                  />
                </div>
              </div>

              <div>
                <Textarea
                  label="Description"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter meal option description"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vegetarian</label>
                    <Switch
                      checked={formData.is_vegetarian || false}
                      onChange={(checked) => handleSwitchChange('is_vegetarian', checked)}
                    />
                  </div>
                </div>
                <div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vegan</label>
                    <Switch
                      checked={formData.is_vegan || false}
                      onChange={(checked) => handleSwitchChange('is_vegan', checked)}
                    />
                  </div>
                </div>
                <div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gluten-Free</label>
                    <Switch
                      checked={formData.is_gluten_free || false}
                      onChange={(checked) => handleSwitchChange('is_gluten_free', checked)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Active</label>
                  <Switch
                    checked={formData.is_active || false}
                    onChange={(checked) => handleSwitchChange('is_active', checked)}
                  />
                </div>
                <p className="mt-1 text-sm text-[var(--color-text-tertiary)]">
                  Inactive meal options will not be available for selection.
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/meal-options')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSaving}
                >
                  {isEditMode ? 'Update Meal Option' : 'Create Meal Option'}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default AdminMealOptionFormPage;
