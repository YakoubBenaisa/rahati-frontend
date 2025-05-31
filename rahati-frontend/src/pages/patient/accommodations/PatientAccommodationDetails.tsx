import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../../../layouts';
import { Card, Button, Badge } from '../../../components/ui';
import { useAuth } from '../../../hooks';
import { motion } from 'framer-motion';

interface AccommodationDetails {
  id: number;
  center: {
    id: number;
    name: string;
    address: string;
    phone: string;
  };
  room: {
    id: number;
    roomNumber: string;
    type: string;
    description: string;
    pricePerNight: number;
    isAccessible: boolean;
  };
  checkInDate: string;
  checkOutDate: string;
  numberOfNights: number;
  numberOfGuests: number;
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
  totalPrice: number;
  mealOption?: {
    id: number;
    name: string;
    description: string;
    price: number;
  };
  specialRequests?: string;
  appointment: {
    id: number;
    date: string;
    time: string;
    provider: string;
  };
  createdAt: string;
  updatedAt: string;
}

const PatientAccommodationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth('Patient');
  const [isLoading, setIsLoading] = useState(true);
  const [accommodation, setAccommodation] = useState<AccommodationDetails | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  // Mock fetch accommodation data
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      
      
      setAccommodation();
      setIsLoading(false);
    }, 1000);
  }, [id]);

  // Handle cancellation
  const handleCancelAccommodation = () => {
    if (!accommodation) return;
    
    if (window.confirm('Are you sure you want to cancel this accommodation booking? This action cannot be undone.')) {
      setIsCancelling(true);
      
      // Simulate API call
      setTimeout(() => {
        setAccommodation({
          ...accommodation,
          status: 'cancelled',
          updatedAt: new Date().toISOString()
        });
        setIsCancelling(false);
      }, 1000);
    }
  };

  // Format status for display
  const formatStatus = (status: string): string => {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get status badge variant
  const getStatusVariant = (status: string): string => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'checked_in':
        return 'primary';
      case 'checked_out':
        return 'info';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center py-12">
            <svg className="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!accommodation) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Accommodation not found</h3>
              <p className="mt-1 text-sm text-gray-500">The accommodation booking you're looking for doesn't exist or you don't have access.</p>
              <div className="mt-6">
                <Button
                  onClick={() => navigate('/patient/accommodations')}
                  variant="primary"
                >
                  Back to Accommodations
                </Button>
              </div>
            </div>
          </Card>
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
            <div className="flex items-center">
              <Button
                onClick={() => navigate('/patient/accommodations')}
                variant="outline"
                size="sm"
                className="mr-4"
                leftIcon={
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                }
              >
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Accommodation Details</h1>
                <p className="text-gray-600">
                  Booking #{accommodation.id} - {accommodation.center.name}
                </p>
              </div>
              <Badge
                variant={getStatusVariant(accommodation.status)}
                className="ml-4"
              >
                {formatStatus(accommodation.status)}
              </Badge>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              {(accommodation.status === 'pending' || accommodation.status === 'confirmed') && (
                <>
                  <Button
                    as={Link}
                    to={`/patient/accommodations/${accommodation.id}/modify`}
                    variant="primary"
                  >
                    Modify Booking
                  </Button>
                  <Button
                    onClick={handleCancelAccommodation}
                    variant="danger"
                    isLoading={isCancelling}
                  >
                    Cancel Booking
                  </Button>
                </>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Booking Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card title="Booking Summary">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Stay Details</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Check-in Date:</span>
                      <p className="mt-1">{new Date(accommodation.checkInDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Check-out Date:</span>
                      <p className="mt-1">{new Date(accommodation.checkOutDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Number of Nights:</span>
                      <p className="mt-1">{accommodation.numberOfNights}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Number of Guests:</span>
                      <p className="mt-1">{accommodation.numberOfGuests}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Room Type:</span>
                      <p className="mt-1">{accommodation.room.type} (Room {accommodation.room.roomNumber})</p>
                    </div>
                    {accommodation.mealOption && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Meal Option:</span>
                        <p className="mt-1">{accommodation.mealOption.name}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Appointment Details</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Appointment Date:</span>
                      <p className="mt-1">{new Date(accommodation.appointment.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Appointment Time:</span>
                      <p className="mt-1">{accommodation.appointment.time}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Provider:</span>
                      <p className="mt-1">{accommodation.appointment.provider}</p>
                    </div>
                    <div className="pt-2">
                      <Button
                        as={Link}
                        to={`/patient/appointments/${accommodation.appointment.id}`}
                        variant="outline"
                        size="sm"
                      >
                        View Appointment Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {accommodation.specialRequests && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Special Requests</h3>
                  <p className="text-gray-700">{accommodation.specialRequests}</p>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Price Breakdown</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Room ({accommodation.numberOfNights} nights × ${accommodation.room.pricePerNight.toFixed(2)})</span>
                    <span className="text-gray-900">${(accommodation.room.pricePerNight * accommodation.numberOfNights).toFixed(2)}</span>
                  </div>
                  {accommodation.mealOption && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Meals ({accommodation.mealOption.name})</span>
                      <span className="text-gray-900">${accommodation.mealOption.price.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-medium pt-2 border-t border-gray-100">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">${accommodation.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Center Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card title="Healthcare Center">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{accommodation.center.name}</h3>
                  <p className="text-gray-600 mt-1">{accommodation.center.address}</p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-500">Contact:</span>
                  <p className="mt-1">{accommodation.center.phone}</p>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Room Information</h4>
                  <p className="text-gray-700 mb-2">{accommodation.room.description}</p>
                  {accommodation.room.isAccessible && (
                    <Badge variant="info">Accessible</Badge>
                  )}
                </div>
                
                {accommodation.mealOption && (
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Meal Option</h4>
                    <p className="text-gray-700">{accommodation.mealOption.description}</p>
                  </div>
                )}
                
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Booking Information</h4>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-600">
                      <span className="font-medium">Booked on:</span> {new Date(accommodation.createdAt).toLocaleDateString()}
                    </p>
                    {accommodation.createdAt !== accommodation.updatedAt && (
                      <p className="text-gray-600">
                        <span className="font-medium">Last updated:</span> {new Date(accommodation.updatedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PatientAccommodationDetails;
