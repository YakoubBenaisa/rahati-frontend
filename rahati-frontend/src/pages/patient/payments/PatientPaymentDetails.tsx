import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MainLayout } from '../../../layouts';
import { Button, Alert } from '../../../components/ui';
import { usePaymentStore } from '../../../store';

const PatientPaymentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { 
    selectedPayment: payment, 
    fetchPaymentById, 
    isLoading, 
    error 
  } = usePaymentStore();

  useEffect(() => {
    if (id) {
      fetchPaymentById(Number(id));
    }
  }, [id, fetchPaymentById]);

  // Format date to display in a more readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format time from datetime string
  const formatTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Get status badge color based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'refunded':
        return 'bg-purple-100 text-purple-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center">
          <Link
            to="/patient/payments"
            className="inline-flex items-center text-gray-600 hover:text-primary-600"
          >
            <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Payments
          </Link>
        </div>

        {error && (
          <Alert
            variant="error"
            title="Error"
            message={error}
            className="mb-6"
          />
        )}

        {isLoading ? (
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="animate-pulse space-y-6">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
              <div className="h-40 bg-gray-200 rounded"></div>
            </div>
          </div>
        ) : payment ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              {/* Payment header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      Payment Details
                    </h1>
                    <p className="mt-1 text-gray-600">
                      {formatDate(payment.payment_date)}
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment details */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Payment information */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h2>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Amount</p>
                          <p className="text-xl font-semibold text-gray-900">{formatCurrency(payment.amount)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Payment Method</p>
                          <p className="text-gray-900">
                            {payment.payment_method.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Payment Date</p>
                          <p className="text-gray-900">{formatDate(payment.payment_date)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Status</p>
                          <p className="text-gray-900">{payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Related appointment */}
                  {payment.appointment && (
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">Related Appointment</h2>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Date & Time</p>
                            <p className="text-gray-900">
                              {formatDate(payment.appointment.appointment_datetime)} at {formatTime(payment.appointment.appointment_datetime)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Provider</p>
                            <p className="text-gray-900">
                              {payment.appointment.provider?.name || 'Provider not specified'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Center</p>
                            <p className="text-gray-900">
                              {payment.appointment.center?.name || 'Center not specified'}
                            </p>
                          </div>
                          <div>
                            <Link
                              to={`/patient/appointments/${payment.appointment.id}`}
                              className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
                            >
                              View Appointment Details
                              <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Notes */}
                {payment.notes && (
                  <div className="mt-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Notes</h2>
                    <p className="text-gray-600 bg-gray-50 p-4 rounded-md">
                      {payment.notes}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  {payment.status === 'pending' && (
                    <Button
                      as={Link}
                      to={`/patient/payments/${payment.id}/pay`}
                      variant="primary"
                    >
                      Pay Now
                    </Button>
                  )}
                  <Button
                    as={Link}
                    to="/patient/payments"
                    variant="outline"
                  >
                    Back to Payments
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 text-center">
            <svg className="h-12 w-12 mx-auto text-gray-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h4 className="text-lg font-medium text-gray-900 mb-2">Payment Not Found</h4>
            <p className="text-gray-600 mb-4">
              The payment you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Button
              as={Link}
              to="/patient/payments"
              variant="primary"
            >
              Back to Payments
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default PatientPaymentDetails;
