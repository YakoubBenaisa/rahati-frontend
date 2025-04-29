import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MainLayout } from '../layouts';
import { Button, Card } from '../components/ui';

const LandingPage: React.FC = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Features data
  const features = [
    {
      title: 'Find Healthcare Centers',
      description: 'Discover top-rated healthcare centers near you with our comprehensive directory.',
      icon: (
        <svg className="h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      title: 'Book Appointments',
      description: 'Schedule appointments with healthcare providers quickly and easily.',
      icon: (
        <svg className="h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Accommodation Services',
      description: 'Find comfortable accommodations near your healthcare center for your stay.',
      icon: (
        <svg className="h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      title: 'Transportation',
      description: 'Arrange transportation to and from healthcare facilities with ease.',
      icon: (
        <svg className="h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
    },
    {
      title: 'Meal Options',
      description: 'Choose from a variety of meal options tailored to your dietary needs.',
      icon: (
        <svg className="h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      title: 'Feedback System',
      description: 'Share your experience and help us improve our services.',
      icon: (
        <svg className="h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
    },
  ];

  // Testimonials data
  const testimonials = [
    {
      quote: "Rahati Healthcare made my medical journey so much easier. From booking appointments to finding accommodation, everything was seamless.",
      author: "Sarah Johnson",
      role: "Patient",
    },
    {
      quote: "As a healthcare provider, Rahati has streamlined my practice and helped me connect with patients more efficiently.",
      author: "Dr. Michael Chen",
      role: "Cardiologist",
    },
    {
      quote: "The accommodation services were excellent. Clean rooms, friendly staff, and conveniently located near the medical center.",
      author: "Robert Williams",
      role: "Patient",
    },
  ];

  return (
    <MainLayout>
      {/* Hero section */}
      <section className="py-16 md:py-24 relative overflow-hidden w-full">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary-50)] via-[var(--color-bg-primary)] to-[var(--color-secondary-50)] opacity-70"></div>

          <svg className="absolute top-0 right-0 h-full w-full opacity-10 text-[var(--color-primary-300)]" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid-pattern)" />
          </svg>

          <motion.div
            className="absolute top-10 left-10 w-64 h-64 rounded-full bg-[var(--color-primary-200)] opacity-20"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 30, 0],
              y: [0, 20, 0]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <motion.div
            className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-[var(--color-secondary-200)] opacity-20"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -40, 0],
              y: [0, -30, 0]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <motion.div
            className="absolute top-1/2 right-1/4 w-40 h-40 rounded-full bg-[var(--color-accent)] opacity-10"
            animate={{
              scale: [1, 1.4, 1],
              x: [0, 50, 0],
              y: [0, -40, 0]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl w-full mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block px-6 py-2 bg-[var(--color-primary-100)] text-[var(--color-primary-700)] rounded-full mb-6 font-medium"
          >
            Welcome to Rahati Healthcare
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-[var(--color-text-primary)] leading-tight mb-6"
          >
            Quality Healthcare <span className="bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-accent)] bg-clip-text text-transparent">Made Accessible</span> for Everyone
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-[var(--color-text-secondary)] max-w-3xl mx-auto mb-10"
          >
            Connecting patients with healthcare providers, accommodations, and transportation services for a seamless healthcare experience.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16"
          >
            <Button
              as={Link}
              to="/centers"
              variant="primary"
              size="lg"
              className="px-10 py-6 text-lg shadow-lg"
            >
              Find Healthcare Centers
            </Button>
            <Button
              as={Link}
              to="/register"
              variant="secondary"
              size="lg"
              className="px-10 py-6 text-lg shadow-lg"
            >
              Sign Up Now
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8"
          >
            <div className="bg-[var(--color-bg-primary)] p-6 rounded-xl shadow-md border border-[var(--color-border)]">
              <div className="text-4xl font-bold text-[var(--color-primary-600)] mb-2">500+</div>
              <div className="text-[var(--color-text-secondary)]">Healthcare Centers</div>
            </div>
            <div className="bg-[var(--color-bg-primary)] p-6 rounded-xl shadow-md border border-[var(--color-border)]">
              <div className="text-4xl font-bold text-[var(--color-secondary-600)] mb-2">10,000+</div>
              <div className="text-[var(--color-text-secondary)]">Satisfied Patients</div>
            </div>
            <div className="bg-[var(--color-bg-primary)] p-6 rounded-xl shadow-md border border-[var(--color-border)]">
              <div className="text-4xl font-bold text-[var(--color-accent)] mb-2">2,000+</div>
              <div className="text-[var(--color-text-secondary)]">Medical Professionals</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-16 my-16 relative overflow-hidden w-full">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary-50)] to-[var(--color-secondary-50)] opacity-80 z-0"></div>
        <div className="absolute inset-0 z-0">
          <svg className="absolute top-0 left-0 w-full h-full text-[var(--color-primary-200)] opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M 8 0 L 0 0 0 8" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl w-full mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block px-6 py-2 bg-[var(--color-primary-100)] text-[var(--color-primary-700)] rounded-full mb-4 font-medium"
            >
              Our Services
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold text-[var(--color-text-primary)] mb-4"
            >
              <span className="bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-secondary-600)] bg-clip-text text-transparent">Comprehensive Healthcare</span> Services
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-4 text-xl text-[var(--color-text-secondary)] max-w-3xl mx-auto"
            >
              Designed to make your medical journey comfortable and stress-free.
            </motion.p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full border border-[var(--color-border)] bg-[var(--color-bg-primary)] shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden" hoverable>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[var(--color-primary-200)] to-transparent opacity-30 rounded-bl-full"></div>
                  <div className="flex flex-col items-center text-center relative z-10">
                    <div className="p-4 bg-gradient-to-br from-[var(--color-primary-100)] to-[var(--color-secondary-100)] rounded-full mb-6 shadow-inner">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">{feature.title}</h3>
                    <p className="text-[var(--color-text-secondary)]">{feature.description}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-4"
                      as={Link}
                      to="/services"
                    >
                      Learn More
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works section */}
      <section className="py-20 bg-[var(--color-bg-primary)] w-full">
        <div className="max-w-7xl w-full mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block px-6 py-2 bg-[var(--color-secondary-100)] text-[var(--color-secondary-700)] rounded-full mb-4 font-medium"
            >
              Simple Process
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold text-[var(--color-text-primary)] mb-4"
            >
              How It <span className="bg-gradient-to-r from-[var(--color-secondary-600)] to-[var(--color-accent)] bg-clip-text text-transparent">Works</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-4 text-xl text-[var(--color-text-secondary)] max-w-3xl mx-auto"
            >
              Simple steps to access quality healthcare services through our platform.
            </motion.p>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-24 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-primary-300)] via-[var(--color-secondary-300)] to-[var(--color-accent)] hidden md:block"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative bg-[var(--color-bg-secondary)] p-8 rounded-2xl shadow-lg border border-[var(--color-border)]"
              >
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 inline-flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-700)] text-white text-3xl font-bold shadow-lg">1</div>
                <div className="pt-10">
                  <h3 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-4 text-center">Create an Account</h3>
                  <p className="text-[var(--color-text-secondary)] text-center">Sign up as a patient or healthcare provider to access our services.</p>
                  <div className="mt-6 text-center">
                    <Button
                      as={Link}
                      to="/register"
                      variant="outline"
                      size="sm"
                    >
                      Register Now
                    </Button>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="relative bg-[var(--color-bg-secondary)] p-8 rounded-2xl shadow-lg border border-[var(--color-border)]"
              >
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 inline-flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-[var(--color-secondary-500)] to-[var(--color-secondary-700)] text-white text-3xl font-bold shadow-lg">2</div>
                <div className="pt-10">
                  <h3 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-4 text-center">Find Healthcare Centers</h3>
                  <p className="text-[var(--color-text-secondary)] text-center">Browse and select from our network of quality healthcare providers.</p>
                  <div className="mt-6 text-center">
                    <Button
                      as={Link}
                      to="/centers"
                      variant="outline"
                      size="sm"
                    >
                      Explore Centers
                    </Button>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="relative bg-[var(--color-bg-secondary)] p-8 rounded-2xl shadow-lg border border-[var(--color-border)]"
              >
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 inline-flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-primary-700)] text-white text-3xl font-bold shadow-lg">3</div>
                <div className="pt-10">
                  <h3 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-4 text-center">Book Services</h3>
                  <p className="text-[var(--color-text-secondary)] text-center">Schedule appointments, book accommodations, and arrange transportation.</p>
                  <div className="mt-6 text-center">
                    <Button
                      as={Link}
                      to="/services"
                      variant="outline"
                      size="sm"
                    >
                      View Services
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials section */}
      <section className="py-20 my-12 relative overflow-hidden w-full">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-secondary-50)] to-[var(--color-primary-50)] opacity-80 z-0"></div>
        <div className="absolute inset-0 z-0">
          <svg className="absolute top-0 left-0 w-full h-full text-[var(--color-secondary-200)] opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="10,10" />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl w-full mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block px-6 py-2 bg-[var(--color-accent)] bg-opacity-20 text-[var(--color-accent)] rounded-full mb-4 font-medium"
            >
              Testimonials
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold text-[var(--color-text-primary)] mb-4"
            >
              What Our <span className="bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-secondary-600)] bg-clip-text text-transparent">Users Say</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                <Card className="h-full bg-[var(--color-bg-primary)] border border-[var(--color-border)] shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex flex-col h-full relative">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[var(--color-secondary-200)] to-transparent opacity-30 rounded-bl-full"></div>

                    <div className="relative z-10">
                      <div className="p-2 bg-gradient-to-br from-[var(--color-secondary-100)] to-[var(--color-accent)] bg-opacity-50 rounded-full w-fit mb-6">
                        <svg className="h-8 w-8 text-[var(--color-secondary-700)]" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                        </svg>
                      </div>
                      <p className="text-[var(--color-text-secondary)] flex-grow text-lg italic">{testimonial.quote}</p>
                      <div className="mt-6 pt-4 border-t border-[var(--color-border)]">
                        <p className="font-semibold text-[var(--color-text-primary)]">{testimonial.author}</p>
                        <p className="text-sm text-[var(--color-text-tertiary)]">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button
              as={Link}
              to="/about"
              variant="outline"
              size="lg"
              className="px-8"
            >
              Learn More About Us
            </Button>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-20 w-full">
        <div className="max-w-7xl w-full mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl shadow-2xl"
        >
          {/* Background with animated gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary-700)] via-[var(--color-secondary-700)] to-[var(--color-primary-800)] z-0">
            <motion.div
              className="absolute inset-0 opacity-30"
              animate={{
                background: [
                  'radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.2) 0%, rgba(0, 0, 0, 0) 50%)',
                  'radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.2) 0%, rgba(0, 0, 0, 0) 50%)',
                  'radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.2) 0%, rgba(0, 0, 0, 0) 50%)'
                ]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 p-8 md:p-16 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-white mb-6"
            >
              Ready to Experience <span className="text-[var(--color-secondary-300)]">Better Healthcare?</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-white text-opacity-90 mb-10 max-w-3xl mx-auto"
            >
              Join thousands of patients and healthcare providers on our platform and transform your healthcare experience.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6"
            >
              <Button
                as={Link}
                to="/register"
                variant="secondary"
                size="lg"
                className="px-10 py-6 text-lg shadow-lg"
              >
                Sign Up Now
              </Button>
              <Button
                as={Link}
                to="/centers"
                variant="outline"
                size="lg"
                className="px-10 py-6 text-lg bg-transparent text-white border-white hover:bg-white hover:text-[var(--color-primary-700)]"
              >
                Explore Centers
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-12 pt-8 border-t border-white border-opacity-20 flex flex-wrap justify-center gap-8"
            >
              <div className="flex items-center text-white">
                <svg className="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center text-white">
                <svg className="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center text-white">
                <svg className="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                <span>Trusted by 10,000+ Users</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};

export default LandingPage;
