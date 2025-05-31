import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MainLayout } from '../../../layouts';
import { Button, Alert, Input, Select } from '../../../components/ui';
import { usePaymentStore } from '../../../store';

interface PaymentFormValues {
  payment_method: string;
  card_number?: string;
  expiry_date?: string;
  cvv?: string;
  cardholder_name?: string;
}

const PatientPaymentProcess: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    selectedPayment: payment, 
    fetchPaymentById, 
    updatePayment,
    isLoading, 
    error: paymentError 
  } = usePaymentStore();
  
  const [formValues, setFormValues] = useState<PaymentFormValues>({
    payment_method: 'credit_card',
    card_number: '',
    expiry_date: '',
    cvv: '',
    cardholder_name: ''
  });
  
  const [errors, setErrors] = useState<Partial<PaymentFormValues>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchPaymentById(Number(id));
    }
  }, [id, fetchPaymentById]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'dzd'
    }).format(amount);
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormValues({
      ...formValues,
      [name]: value
    });
    
    // Clear error for this field
    if (errors[name as keyof PaymentFormValues]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };

  // Validate form
  const validateForm = (): Partial<PaymentFormValues> => {
    const newErrors: Partial<PaymentFormValues> = {};
    
    if (formValues.payment_method === 'credit_card' || formValues.payment_method === 'debit_card') {
      if (!formValues.card_number) {
        newErrors.card_number = 'Card number is required';
      } else if (!/^\d{16}$/.test(formValues.card_number.replace(/\s/g, ''))) {
        newErrors.card_number = 'Invalid card number';
      }
      
      if (!formValues.expiry_date) {
        newErrors.expiry_date = 'Expiry date is required';
      } else if (!/^\d{2}\/\d{2}$/.test(formValues.expiry_date)) {
        newErrors.expiry_date = 'Invalid expiry date (MM/YY)';
      }
      
      if (!formValues.cvv) {
        newErrors.cvv = 'CVV is required';
      } else if (!/^\d{3,4}$/.test(formValues.cvv)) {
        newErrors.cvv = 'Invalid CVV';
      }
      
      if (!formValues.cardholder_name) {
        newErrors.cardholder_name = 'Cardholder name is required';
      }
    }
    
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    if (!payment) {
      setError('Payment information not found');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // In a real application, you would process the payment with a payment gateway
      // For this demo, we'll just update the payment status
      await updatePayment(payment.id, {
        status: 'completed',
        payment_method: formValues.payment_method
      });
      
      setSuccess(true);
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate(`/patient/payments/${payment.id}`);
      }, 2000);
    } catch (err) {
      console.error('Error processing payment:', err);
      setError('Failed to process payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center">
          <Link
            to={`/patient/payments/${id}`}
            className="inline-flex items-center text-gray-600 hover:text-primary-600"
          >
            <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Payment Details
          </Link>
        </div>

        {error && (
          <Alert
            variant="error"
            title="Error"
            message={error}
            onClose={() => setError(null)}
            className="mb-6"
          />
        )}

        {paymentError && (
          <Alert
            variant="error"
            title="Error"
            message={paymentError}
            className="mb-6"
          />
        )}

        {success && (
          <Alert
            variant="success"
            title="Payment Successful"
            message="Your payment has been processed successfully. Redirecting to payment details..."
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
              <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900">
                  Process Payment
                </h1>
                <p className="mt-1 text-gray-600">
                  Complete your payment of {payment.amount ? formatCurrency(payment.amount) : 'N/A'}
                </p>
              </div>

              <div className="p-6">
                {/* Payment summary */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Payment Summary</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Amount</p>
                      <p className="text-xl font-semibold text-gray-900">
                        {payment.amount ? formatCurrency(payment.amount) : 'N/A'}
                      </p>
                    </div>
                    {payment.appointment && (
                      <div>
                        <p className="text-sm text-gray-600">For</p>
                        <p className="text-gray-900">
                          Appointment on {new Date(payment.appointment.appointment_datetime).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* Payment method */}
                  <div className="mb-6">
                    <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Method*
                    </label>
                    <Select
                      id="payment_method"
                      name="payment_method"
                      value={formValues.payment_method}
                      onChange={handleInputChange}
                      required
                      className="w-full"
                    >
                      <option value="credit_card">Credit Card</option>
                      <option value="debit_card">Debit Card</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="insurance">Insurance</option>
                    </Select>
                  </div>

                  {/* Credit/Debit card details */}
                  {(formValues.payment_method === 'credit_card' || formValues.payment_method === 'debit_card') && (
                    <div className="space-y-4 mb-6">
                      <div>
                        <label htmlFor="card_number" className="block text-sm font-medium text-gray-700 mb-1">
                          Card Number*
                        </label>
                        <Input
                          id="card_number"
                          name="card_number"
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          value={formValues.card_number}
                          onChange={handleInputChange}
                          error={errors.card_number}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="expiry_date" className="block text-sm font-medium text-gray-700 mb-1">
                            Expiry Date (MM/YY)*
                          </label>
                          <Input
                            id="expiry_date"
                            name="expiry_date"
                            type="text"
                            placeholder="MM/YY"
                            value={formValues.expiry_date}
                            onChange={handleInputChange}
                            error={errors.expiry_date}
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                            CVV*
                          </label>
                          <Input
                            id="cvv"
                            name="cvv"
                            type="text"
                            placeholder="123"
                            value={formValues.cvv}
                            onChange={handleInputChange}
                            error={errors.cvv}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="cardholder_name" className="block text-sm font-medium text-gray-700 mb-1">
                          Cardholder Name*
                        </label>
                        <Input
                          id="cardholder_name"
                          name="cardholder_name"
                          type="text"
                          placeholder="John Doe"
                          value={formValues.cardholder_name}
                          onChange={handleInputChange}
                          error={errors.cardholder_name}
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Bank transfer instructions */}
                  {formValues.payment_method === 'bank_transfer' && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <h3 className="text-md font-semibold text-gray-900 mb-2">Bank Transfer Instructions</h3>
                      <p className="text-gray-600 mb-2">
                        Please transfer the amount to the following bank account:
                      </p>
                      <div className="grid grid-cols-1 gap-2">
                        <p className="text-gray-600">
                          <span className="font-medium">Bank Name:</span> Rahati Healthcare Bank
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Account Name:</span> Rahati Healthcare Services
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Account Number:</span> 1234567890
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Routing Number:</span> 987654321
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Reference:</span> Payment ID {payment.id}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Insurance information */}
                  {formValues.payment_method === 'insurance' && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <h3 className="text-md font-semibold text-gray-900 mb-2">Insurance Information</h3>
                      <p className="text-gray-600 mb-2">
                        Please contact our billing department at billing@rahati.com or call (123) 456-7890 to process your insurance claim.
                      </p>
                      <p className="text-gray-600">
                        Please provide your insurance details and reference Payment ID {payment.id}.
                      </p>
                    </div>
                  )}

                  {/* Submit button */}
                  <div className="mt-8 flex justify-end">
                    <Button
                      type="submit"
                      variant="primary"
                      isLoading={isSubmitting}
                      disabled={isSubmitting || success}
                    >
                      {formValues.payment_method === 'bank_transfer' || formValues.payment_method === 'insurance'
                        ? 'Confirm Payment Method'
                        : 'Process Payment'}
                    </Button>
                  </div>
                </form>
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
              The payment you're trying to process doesn't exist or you don't have permission to access it.
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

export default PatientPaymentProcess;
