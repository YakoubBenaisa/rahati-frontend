import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../../layouts';
import { Card, Button, Alert, Spinner, Badge, Table, Pagination } from '../../../components/ui';
import { motion } from 'framer-motion';
import { roomsAPI } from '../../../services/api';
import { Room } from '../../../types';

const AdminRoomsPage: React.FC = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const itemsPerPage = 10;

  // Fetch rooms
  useEffect(() => {
    const fetchRooms = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await roomsAPI.getRooms({
          page: currentPage,
          per_page: itemsPerPage
        });
        
        const data = response.data;
        setRooms(data.data || data);
        
        // Handle pagination if available
        if (data.meta) {
          setTotalPages(data.meta.last_page);
          setTotalItems(data.meta.total);
        }
      } catch (err) {
        console.error('Error fetching rooms:', err);
        setError('Failed to load rooms. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRooms();
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
              <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Rooms</h1>
              <p className="mt-2 text-[var(--color-text-secondary)]">
                Manage all rooms across healthcare centers.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button
                onClick={() => navigate('/admin/rooms/new')}
                variant="primary"
                leftIcon={
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                }
              >
                Add Room
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
                <span className="ml-3 text-[var(--color-text-secondary)]">Loading rooms...</span>
              </div>
            ) : rooms.length === 0 ? (
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
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-[var(--color-text-primary)]">No rooms found</h3>
                <p className="mt-1 text-[var(--color-text-secondary)]">Get started by adding a new room.</p>
                <div className="mt-6">
                  <Button
                    onClick={() => navigate('/admin/rooms/new')}
                    variant="primary"
                  >
                    Add Room
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <Table>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>ID</Table.HeaderCell>
                      <Table.HeaderCell>Room Number</Table.HeaderCell>
                      <Table.HeaderCell>Center</Table.HeaderCell>
                      <Table.HeaderCell>Type</Table.HeaderCell>
                      <Table.HeaderCell>Price/Night</Table.HeaderCell>
                      <Table.HeaderCell>Capacity</Table.HeaderCell>
                      <Table.HeaderCell>Status</Table.HeaderCell>
                      <Table.HeaderCell>Actions</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {rooms.map((room) => (
                      <Table.Row key={room.id}>
                        <Table.Cell>{room.id}</Table.Cell>
                        <Table.Cell>{room.room_number}</Table.Cell>
                        <Table.Cell>{room.center?.name || `Center #${room.center_id}`}</Table.Cell>
                        <Table.Cell>{room.type}</Table.Cell>
                        <Table.Cell>${room.price_per_night}</Table.Cell>
                        <Table.Cell>{room.capacity} person(s)</Table.Cell>
                        <Table.Cell>
                          <Badge 
                          //variant={room.is_available ? 'success' : 'error'}
                          >
                            {room.is_available ? 'Available' : 'Unavailable'}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/admin/rooms/${room.id}`)}
                            >
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/admin/rooms/${room.id}/edit`)}
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

export default AdminRoomsPage;
