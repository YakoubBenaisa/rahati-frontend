import React from 'react';
import { MainLayout } from '../layouts';
import { motion } from 'framer-motion';

const ServicesPage: React.FC = () => {
  const services = [
    {
      id: 1,
      title: 'Medical Consultations',
      description: 'Connect with healthcare providers for in-person or virtual consultations.',
      icon: (
        <svg className="h-8 w-8 text-[var(--color-primary-600)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      id: 2,
      title: 'Accommodation Booking',
      description: 'Find and book comfortable accommodations near healthcare facilities.',
      icon: (
        <svg className="h-8 w-8 text-[var(--color-primary-600)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      id: 3,
      title: 'Transportation Services',
      description: 'Arrange reliable transportation to and from medical appointments.',
      icon: (
        <svg className="h-8 w-8 text-[var(--color-primary-600)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
    },
    {
      id: 4,
      title: 'Appointment Scheduling',
      description: 'Book and manage appointments with healthcare providers.',
      icon: (
        <svg className="h-8 w-8 text-[var(--color-primary-600)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 5,
      title: 'Medical Records Management',
      description: 'Securely store and access your medical records.',
      icon: (
        <svg className="h-8 w-8 text-[var(--color-primary-600)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      id: 6,
      title: 'Medication Management',
      description: 'Track and manage your medications and receive reminders.',
      icon: (
        <svg className="h-8 w-8 text-[var(--color-primary-600)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-6">
            Our Services
          </h1>
          
          <p className="text-lg text-[var(--color-text-secondary)] mb-8">
            Rahati Healthcare provides a comprehensive range of services designed to make healthcare 
            accessible, convenient, and comfortable for all patients.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[var(--color-bg-primary)] rounded-lg shadow-md p-6 border border-[var(--color-border)] hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {service.icon}
                  </div>
                  <div className="ml-4">
                    <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                      {service.title}
                    </h2>
                    <p className="text-[var(--color-text-secondary)]">
                      {service.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 bg-[var(--color-bg-primary)] rounded-lg shadow-md p-6 border border-[var(--color-border)]">
            <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-4">
              How It Works
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[var(--color-primary-600)] text-white flex items-center justify-center font-bold">
                  1
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-[var(--color-text-primary)]">
                    Create an Account
                  </h3>
                  <p className="text-[var(--color-text-secondary)]">
                    Sign up for a Rahati Healthcare account to access our full range of services.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[var(--color-primary-600)] text-white flex items-center justify-center font-bold">
                  2
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-[var(--color-text-primary)]">
                    Find Healthcare Providers
                  </h3>
                  <p className="text-[var(--color-text-secondary)]">
                    Search for healthcare providers and centers based on location, specialty, and availability.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[var(--color-primary-600)] text-white flex items-center justify-center font-bold">
                  3
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-[var(--color-text-primary)]">
                    Book Appointments
                  </h3>
                  <p className="text-[var(--color-text-secondary)]">
                    Schedule appointments with your chosen healthcare providers.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[var(--color-primary-600)] text-white flex items-center justify-center font-bold">
                  4
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-[var(--color-text-primary)]">
                    Arrange Accommodations & Transportation
                  </h3>
                  <p className="text-[var(--color-text-secondary)]">
                    If needed, book accommodations near your healthcare facility and arrange transportation.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[var(--color-primary-600)] text-white flex items-center justify-center font-bold">
                  5
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-[var(--color-text-primary)]">
                    Receive Care & Manage Your Health
                  </h3>
                  <p className="text-[var(--color-text-secondary)]">
                    Attend your appointments and use our platform to manage your ongoing healthcare needs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default ServicesPage;
