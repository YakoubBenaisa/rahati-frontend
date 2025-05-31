import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MainLayout } from '../../../layouts';
import { Card, Button, Alert, Spinner, Badge } from '../../../components/ui';
import { motion } from 'framer-motion';
import { roomsAPI } from '../../../services/api';
import { Room } from '../../../types';
import { formatDate } from '../../../utils/dateUtils';

const AdminRoomDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  // Fetch room data
  useEffect(() => {
    const fetchRoom = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await roomsAPI.getRoomById(Number(id));
        const data = response.data.data || response.data;
        setRoom(data);
      } catch (err) {
        console.error('Error fetching room:', err);
        setError('Failed to load room. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchRoom();
    }
  }, [id]);

  // Handle delete room
  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    
    try {
      await roomsAPI.deleteRoom(Number(id));
      navigate('/admin/rooms', { state: { message: 'Room deleted successfully' } });
    } catch (err) {
      console.error('Error deleting room:', err);
      setError('Failed to delete room. Please try again.');
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
            <span className="ml-3 text-[var(--color-text-secondary)]">Loading room...</span>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!room && !isLoading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Alert
            variant="error"
            message="Room not found."
            className="mb-6"
          />
          <Button
            onClick={() => navigate('/admin/rooms')}
            variant="primary"
          >
            Back to Rooms
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
              <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Room Details</h1>
              <p className="mt-2 text-[var(--color-text-secondary)]">
                View detailed information about this room.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Button
                onClick={() => navigate('/admin/rooms')}
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
                onClick={() => navigate(`/admin/rooms/${id}/edit`)}
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
              message="Are you sure you want to delete this room? This action cannot be undone."
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

        {room && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
                      Room {room.room_number}
                    </h2>
                    <div className="mt-2 flex items-center">
                      <Badge variant={room.is_available ? 'success' : 'error'}>
                        {room.is_available ? 'Available' : 'Unavailable'}
                      </Badge>
                      <span className="ml-4 text-[var(--color-text-secondary)]">
                        Price: ${room.price_per_night} per night
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="info" size="sm">{room.type}</Badge>
                    {room.is_accessible && (
                      <Badge variant="success" size="sm">Accessible</Badge>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-[var(--color-text-primary)]">Description</h3>
                  <p className="mt-2 text-[var(--color-text-secondary)]">{room.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-[var(--color-text-primary)]">Room Details</h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-[var(--color-text-tertiary)]">Center:</span>
                        <span className="text-[var(--color-text-secondary)]">
                          {room.center?.name || `Center #${room.center_id}`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--color-text-tertiary)]">Capacity:</span>
                        <span className="text-[var(--color-text-secondary)]">
                          {room.capacity} person(s)
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--color-text-tertiary)]">Type:</span>
                        <span className="text-[var(--color-text-secondary)]">{room.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--color-text-tertiary)]">Accessible:</span>
                        <span className="text-[var(--color-text-secondary)]">
                          {room.is_accessible ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[var(--color-text-primary)]">System Information</h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-[var(--color-text-tertiary)]">ID:</span>
                        <span className="text-[var(--color-text-secondary)]">{room.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--color-text-tertiary)]">Created:</span>
                        <span className="text-[var(--color-text-secondary)]">
                          {room.created_at ? formatDate(room.created_at, 'datetime') : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--color-text-tertiary)]">Last Updated:</span>
                        <span className="text-[var(--color-text-secondary)]">
                          {room.updated_at ? formatDate(room.updated_at, 'datetime') : 'N/A'}
                        </span>
                      </div>
                    </div>
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

export default AdminRoomDetailsPage;
