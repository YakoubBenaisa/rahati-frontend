import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MainLayout } from '../../../layouts';
import { Card, Button, Input, Textarea, Alert, Switch, Spinner, Select } from '../../../components/ui';
import { useAuth } from '../../../hooks';
import { motion } from 'framer-motion';
import { roomsAPI, centersAPI } from '../../../services/api';
import { Room, Center } from '../../../types';

const AdminRoomFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const { user } = useAuth('Admin');
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<Partial<Room>>({
    center_id: 0,
    room_number: '',
    type: 'single',
    description: '',
    price_per_night: 0,
    capacity: 1,
    is_accessible: false,
    is_available: true
  });
  
  const [centers, setCenters] = useState<Center[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch centers for dropdown
  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const response = await centersAPI.getCenters();
        const data = response.data.data || response.data;
        setCenters(data);
        
        // Set default center if not in edit mode and centers are available
        if (!isEditMode && data.length > 0 && !formData.center_id) {
          setFormData(prev => ({ ...prev, center_id: data[0].id }));
        }
      } catch (err) {
        console.error('Error fetching centers:', err);
        setError('Failed to load centers. Please try again.');
      }
    };
    
    fetchCenters();
  }, []);

  // Fetch room data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchRoom = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
          const response = await roomsAPI.getRoomById(Number(id));
          const data = response.data.data || response.data;
          
          setFormData({
            center_id: data.center_id,
            room_number: data.room_number,
            type: data.type,
            description: data.description,
            price_per_night: data.price_per_night,
            capacity: data.capacity,
            is_accessible: data.is_accessible,
            is_available: data.is_available
          });
        } catch (err) {
          console.error('Error fetching room:', err);
          setError('Failed to load room. Please try again.');
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchRoom();
    }
  }, [id, isEditMode]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle switch changes
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  // Handle numeric input
  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const value = parseFloat(e.target.value);
    setFormData(prev => ({ ...prev, [fieldName]: isNaN(value) ? 0 : value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Validate form data
      if (!formData.room_number?.trim()) {
        throw new Error('Room number is required');
      }
      
      if (!formData.type?.trim()) {
        throw new Error('Room type is required');
      }
      
      if (!formData.description?.trim()) {
        throw new Error('Description is required');
      }
      
      if (formData.price_per_night === undefined || formData.price_per_night < 0) {
        throw new Error('Price per night must be a positive number');
      }
      
      if (formData.capacity === undefined || formData.capacity < 1) {
        throw new Error('Capacity must be at least 1');
      }
      
      if (!formData.center_id) {
        throw new Error('Please select a center');
      }
      
      // Create or update room
      if (isEditMode) {
        await roomsAPI.updateRoom(Number(id), formData);
        setSuccess('Room updated successfully');
      } else {
        await roomsAPI.createRoom(formData);
        setSuccess('Room created successfully');
        
        // Reset form after successful creation
        if (!isEditMode) {
          setFormData({
            center_id: centers.length > 0 ? centers[0].id : 0,
            room_number: '',
            type: 'single',
            description: '',
            price_per_night: 0,
            capacity: 1,
            is_accessible: false,
            is_available: true
          });
        }
      }
      
      // Navigate back to rooms list after a short delay
      setTimeout(() => {
        navigate('/admin/rooms');
      }, 1500);
    } catch (err: any) {
      console.error('Error saving room:', err);
      setError(err.message || 'Failed to save room. Please try again.');
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
            <span className="ml-3 text-[var(--color-text-secondary)]">Loading room...</span>
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
                {isEditMode ? 'Edit Room' : 'Create Room'}
              </h1>
              <p className="mt-2 text-[var(--color-text-secondary)]">
                {isEditMode ? 'Update the details of an existing room.' : 'Add a new room to the system.'}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button
                onClick={() => navigate('/admin/rooms')}
                variant="outline"
                leftIcon={
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                }
              >
                Back to Rooms
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
                  <Select
                    label="Center"
                    name="center_id"
                    value={formData.center_id?.toString() || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, center_id: Number(e.target.value) }))}
                    required
                  >
                    <option value="">Select a center</option>
                    {centers.map(center => (
                      <option key={center.id} value={center.id}>
                        {center.name}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Input
                    label="Room Number"
                    name="room_number"
                    value={formData.room_number || ''}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter room number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Select
                    label="Room Type"
                    name="type"
                    value={formData.type || 'single'}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                    <option value="suite">Suite</option>
                    <option value="deluxe">Deluxe</option>
                  </Select>
                </div>
                <div>
                  <Input
                    label="Price per Night ($)"
                    name="price_per_night"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price_per_night?.toString() || '0'}
                    onChange={(e) => handleNumericChange(e, 'price_per_night')}
                    required
                    placeholder="Enter price per night"
                  />
                </div>
                <div>
                  <Input
                    label="Capacity"
                    name="capacity"
                    type="number"
                    min="1"
                    value={formData.capacity?.toString() || '1'}
                    onChange={(e) => handleNumericChange(e, 'capacity')}
                    required
                    placeholder="Enter capacity"
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
                  placeholder="Enter room description"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Switch
                    label="Accessible"
                    checked={formData.is_accessible || false}
                    onChange={(checked) => handleSwitchChange('is_accessible', checked)}
                  />
                  <p className="mt-1 text-sm text-[var(--color-text-tertiary)]">
                    Is this room accessible for people with disabilities?
                  </p>
                </div>
                <div>
                  <Switch
                    label="Available"
                    checked={formData.is_available || false}
                    onChange={(checked) => handleSwitchChange('is_available', checked)}
                  />
                  <p className="mt-1 text-sm text-[var(--color-text-tertiary)]">
                    Is this room currently available for booking?
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/rooms')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSaving}
                >
                  {isEditMode ? 'Update Room' : 'Create Room'}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default AdminRoomFormPage;
