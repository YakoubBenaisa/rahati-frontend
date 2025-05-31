import React, { useState } from 'react';
import { MainLayout } from '../layouts';
import { motion } from 'framer-motion';
import { Button, Input, Textarea, Alert } from '../components/ui';
import { useForm } from '../hooks';

interface ContactFormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactPage: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  // Form validation
  const validate = (values: ContactFormValues) => {
    const errors: Partial<ContactFormValues> = {};
    
    if (!values.name) {
      errors.name = 'Name is required';
    }
    
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!values.subject) {
      errors.subject = 'Subject is required';
    }
    
    if (!values.message) {
      errors.message = 'Message is required';
    } else if (values.message.length < 10) {
      errors.message = 'Message must be at least 10 characters';
    }
    
    return errors;
  };

  // Form submission handler
  const handleSubmit = (values: ContactFormValues) => {
    // In a real application, you would send this data to your backend
    console.log('Form submitted:', values);
    
    // Show success message
    setIsSubmitted(true);
    setShowAlert(true);
    
    // Reset form
    resetForm();
    
    // Hide alert after 5 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  // Initialize form
  const { values, errors, touched, handleChange, handleBlur, handleSubmit: submitForm, resetForm } = useForm<ContactFormValues>(
    {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
    handleSubmit,
    validate
  );

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-6">
            Contact Us
          </h1>
          
          {showAlert && (
            <Alert 
              type="success" 
              title="Message Sent!" 
              message="Thank you for contacting us. We'll get back to you as soon as possible."
              onClose={() => setShowAlert(false)}
              className="mb-6"
            />
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[var(--color-bg-primary)] rounded-lg shadow-md p-6 border border-[var(--color-border)]">
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
                Get in Touch
              </h2>
              
              <form onSubmit={submitForm}>
                <div className="space-y-4">
                  <div>
                    <Input
                      label="Your Name"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.name && errors.name ? errors.name : ''}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  
                  <div>
                    <Input
                      label="Email Address"
                      name="email"
                      type="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.email && errors.email ? errors.email : ''}
                      placeholder="john.doe@example.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <Input
                      label="Subject"
                      name="subject"
                      value={values.subject}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.subject && errors.subject ? errors.subject : ''}
                      placeholder="How can we help you?"
                      required
                    />
                  </div>
                  
                  <div>
                    <Textarea
                      label="Message"
                      name="message"
                      value={values.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.message && errors.message ? errors.message : ''}
                      placeholder="Please describe your inquiry in detail..."
                      rows={5}
                      required
                    />
                  </div>
                  
                  <div>
                    <Button
                      type="submit"
                      variant="primary"
                      className="w-full"
                    >
                      Send Message
                    </Button>
                  </div>
                </div>
              </form>
            </div>
            
            <div>
              <div className="bg-[var(--color-bg-primary)] rounded-lg shadow-md p-6 border border-[var(--color-border)] mb-6">
                <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
                  Contact Information
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <svg className="h-6 w-6 text-[var(--color-primary-600)] mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-[var(--color-text-primary)]">Email</p>
                      <p className="text-sm text-[var(--color-text-secondary)]">info@rahati.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <svg className="h-6 w-6 text-[var(--color-primary-600)] mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-[var(--color-text-primary)]">Phone</p>
                      <p className="text-sm text-[var(--color-text-secondary)]">+1 (555) RAHATI</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <svg className="h-6 w-6 text-[var(--color-primary-600)] mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-[var(--color-text-primary)]">Address</p>
                      <p className="text-sm text-[var(--color-text-secondary)]">123 Health Street</p>
                      <p className="text-sm text-[var(--color-text-secondary)]">Medical District</p>
                      <p className="text-sm text-[var(--color-text-secondary)]">New York, NY 10001</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-[var(--color-bg-primary)] rounded-lg shadow-md p-6 border border-[var(--color-border)]">
                <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
                  Business Hours
                </h2>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="text-sm text-[var(--color-text-secondary)]">Monday - Friday</p>
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">9:00 AM - 6:00 PM</p>
                  </div>
                  
                  <div className="flex justify-between">
                    <p className="text-sm text-[var(--color-text-secondary)]">Saturday</p>
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">10:00 AM - 4:00 PM</p>
                  </div>
                  
                  <div className="flex justify-between">
                    <p className="text-sm text-[var(--color-text-secondary)]">Sunday</p>
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">Closed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default ContactPage;
