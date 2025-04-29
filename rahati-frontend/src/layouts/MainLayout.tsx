import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks';
import { useAuthStore, useNotificationStore } from '../store';
import { ThemeToggle } from '../components/ui';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { notifications, unreadCount } = useNotificationStore();
  const location = useLocation();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  const handleLogout = async () => {
    await logout('/login');
  };

  // Navigation items based on user role
  const getNavigationItems = () => {
    const commonItems = [
      { name: 'Home', path: '/' },
      { name: 'Centers', path: '/centers' },
    ];

    if (!isAuthenticated) {
      return commonItems;
    }

    const roleBasedItems = [];

    if (user?.role === 'Patient') {
      roleBasedItems.push(
        { name: 'My Appointments', path: '/patient/appointments' },
        { name: 'My Consultations', path: '/patient/consultations' },
        { name: 'Accommodations', path: '/patient/accommodations' },
        { name: 'Transportation', path: '/patient/transportation' },
        { name: 'Payments', path: '/patient/payments' },
      );
    } else if (user?.role === 'Provider') {
      roleBasedItems.push(
        { name: 'My Schedule', path: '/provider/schedule' },
        { name: 'Consultations', path: '/provider/consultations' },
        { name: 'Patients', path: '/provider/patients' },
      );
    } else if (user?.role === 'Admin') {
      roleBasedItems.push(
        { name: 'Dashboard', path: '/admin/dashboard' },
        { name: 'Users', path: '/admin/users' },
        { name: 'Centers', path: '/admin/centers' },
        { name: 'Appointments', path: '/admin/appointments' },
        { name: 'Rooms', path: '/admin/rooms' },
        { name: 'Meal Options', path: '/admin/meal-options' },
        { name: 'Service Capacity', path: '/admin/service-capacity' },
      );
    }

    return [...commonItems, ...roleBasedItems];
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)]">
      {/* Header */}
      <header className="bg-[var(--color-bg-primary)] shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and navigation */}
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="flex items-center">
                  <span className="text-2xl font-bold bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-secondary-600)] bg-clip-text text-transparent">Rahati</span>
                  <span className="ml-1 text-sm text-[var(--color-text-tertiary)]">Healthcare</span>
                </Link>
              </div>

              {/* Desktop navigation - main items only */}
              <nav className="hidden md:ml-6 md:flex md:space-x-4">
                <Link
                  to="/"
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    location.pathname === '/'
                      ? 'text-[var(--color-primary-700)] bg-[var(--color-primary-50)]'
                      : 'text-[var(--color-text-primary)] hover:text-[var(--color-primary-700)] hover:bg-[var(--color-bg-tertiary)]'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/centers"
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    location.pathname === '/centers'
                      ? 'text-[var(--color-primary-700)] bg-[var(--color-primary-50)]'
                      : 'text-[var(--color-text-primary)] hover:text-[var(--color-primary-700)] hover:bg-[var(--color-bg-tertiary)]'
                  }`}
                >
                  Centers
                </Link>
                <Link
                  to="/services"
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    location.pathname === '/services'
                      ? 'text-[var(--color-primary-700)] bg-[var(--color-primary-50)]'
                      : 'text-[var(--color-text-primary)] hover:text-[var(--color-primary-700)] hover:bg-[var(--color-bg-tertiary)]'
                  }`}
                >
                  Services
                </Link>
                <Link
                  to="/about"
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    location.pathname === '/about'
                      ? 'text-[var(--color-primary-700)] bg-[var(--color-primary-50)]'
                      : 'text-[var(--color-text-primary)] hover:text-[var(--color-primary-700)] hover:bg-[var(--color-bg-tertiary)]'
                  }`}
                >
                  About
                </Link>
              </nav>
            </div>

            {/* Right side buttons */}
            <div className="flex items-center">
              {/* Theme toggle */}
              <ThemeToggle className="mr-4" />

              {isAuthenticated ? (
                <>
                  {/* Dashboard button */}
                  <Link
                    to="/dashboard"
                    className="hidden md:inline-flex items-center px-3 py-2 mr-3 text-sm font-medium rounded-md bg-[var(--color-primary-600)] text-white hover:bg-[var(--color-primary-700)] transition-colors"
                  >
                    <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Dashboard
                  </Link>

                  {/* Notifications button */}
                  <div className="relative ml-2">
                    <button
                      type="button"
                      className="p-2 rounded-full text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
                      onClick={toggleNotifications}
                    >
                      <span className="sr-only">View notifications</span>
                      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>

                      {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 block h-2.5 w-2.5 rounded-full bg-[var(--color-error)] ring-2 ring-[var(--color-bg-primary)]" />
                      )}
                    </button>

                    {/* Notifications dropdown */}
                    {isNotificationsOpen && (
                      <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)] focus:outline-none z-10">
                        <div className="py-1">
                          <div className="px-4 py-2 border-b border-[var(--color-border)]">
                            <h3 className="text-sm font-medium text-[var(--color-text-primary)]">Notifications</h3>
                          </div>

                          {notifications.length === 0 ? (
                            <div className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                              No new notifications
                            </div>
                          ) : (
                            <div className="max-h-60 overflow-y-auto">
                              {notifications.slice(0, 5).map((notification) => (
                                <div
                                  key={notification.id}
                                  className={`px-4 py-3 hover:bg-[var(--color-bg-tertiary)] ${!notification.is_read ? 'bg-[var(--color-primary-50)]' : ''}`}
                                >
                                  <p className="text-sm font-medium text-[var(--color-text-primary)]">{notification.title}</p>
                                  <p className="text-sm text-[var(--color-text-secondary)] mt-1">{notification.message}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="border-t border-[var(--color-border)] px-4 py-2">
                            <Link
                              to="/notifications"
                              className="text-sm text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)]"
                              onClick={() => setIsNotificationsOpen(false)}
                            >
                              View all notifications
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Profile dropdown */}
                  <div className="relative ml-2">
                    <button
                      type="button"
                      className="flex items-center max-w-xs rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
                      onClick={toggleProfileMenu}
                    >
                      <span className="sr-only">Open user menu</span>
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[var(--color-primary-600)] to-[var(--color-secondary-600)] text-white flex items-center justify-center shadow-md">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="ml-2 text-[var(--color-text-primary)] hidden md:block font-medium">{user?.name}</span>
                      <svg className="ml-1 h-5 w-5 text-[var(--color-text-tertiary)] hidden md:block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>

                    {/* Profile dropdown menu */}
                    {isProfileMenuOpen && (
                      <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)] focus:outline-none z-10">
                        <div className="py-1">
                          <div className="px-4 py-2 border-b border-[var(--color-border)]">
                            <p className="text-sm font-medium text-[var(--color-text-primary)]">{user?.name}</p>
                            <p className="text-sm text-[var(--color-text-tertiary)]">{user?.email}</p>
                          </div>

                          <Link
                            to="/profile"
                            className="block px-4 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            Your Profile
                          </Link>

                          <Link
                            to="/settings"
                            className="block px-4 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            Settings
                          </Link>

                          <button
                            type="button"
                            className="block w-full text-left px-4 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]"
                            onClick={handleLogout}
                          >
                            Sign out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center md:ml-6">
                  <Link
                    to="/login"
                    className="inline-flex items-center px-4 py-2 border border-[var(--color-primary-600)] text-sm font-medium rounded-md text-[var(--color-primary-600)] bg-[var(--color-bg-primary)] hover:bg-[var(--color-bg-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-700)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
                  >
                    Sign up
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <div className="flex items-center md:hidden ml-3">
                <button
                  type="button"
                  className="inline-flex items-center justify-center p-2 rounded-md text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--color-primary-500)]"
                  onClick={toggleMobileMenu}
                >
                  <span className="sr-only">Open main menu</span>
                  {isMobileMenuOpen ? (
                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-3 py-2 text-base font-medium ${
                    location.pathname === item.path
                      ? 'text-[var(--color-primary-700)] bg-[var(--color-primary-50)] border-l-4 border-[var(--color-primary-500)]'
                      : 'text-[var(--color-text-primary)] hover:text-[var(--color-primary-700)] hover:bg-[var(--color-bg-tertiary)] hover:border-l-4 hover:border-[var(--color-primary-300)]'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {isAuthenticated && (
              <div className="pt-4 pb-3 border-t border-[var(--color-border)]">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[var(--color-primary-600)] to-[var(--color-secondary-600)] text-white flex items-center justify-center shadow-md">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-[var(--color-text-primary)]">{user?.name}</div>
                    <div className="text-sm font-medium text-[var(--color-text-tertiary)]">{user?.email}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-base font-medium text-[var(--color-text-primary)] hover:text-[var(--color-primary-700)] hover:bg-[var(--color-bg-tertiary)]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Your Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-base font-medium text-[var(--color-text-primary)] hover:text-[var(--color-primary-700)] hover:bg-[var(--color-bg-tertiary)]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    type="button"
                    className="block w-full text-left px-4 py-2 text-base font-medium text-[var(--color-text-primary)] hover:text-[var(--color-primary-700)] hover:bg-[var(--color-bg-tertiary)]"
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </header>

      {/* Subnavbar for logged-in users */}
      {isAuthenticated && (
        <div className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)] shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-12">
              <div className="flex overflow-x-auto hide-scrollbar py-1 space-x-1">
                {/* Role-specific navigation items */}
                {navigationItems.slice(2).map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`whitespace-nowrap inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md ${
                      location.pathname === item.path
                        ? 'text-[var(--color-primary-700)] bg-[var(--color-primary-50)]'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-primary-700)] hover:bg-[var(--color-bg-tertiary)]'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Quick actions */}
              <div className="hidden md:flex items-center space-x-2">
                {user?.role === 'Patient' && (
                  <Link
                    to="/patient/book-appointment"
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-[var(--color-secondary-700)] bg-[var(--color-secondary-100)] hover:bg-[var(--color-secondary-200)]"
                  >
                    <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Book Appointment
                  </Link>
                )}
                {user?.role === 'Provider' && (
                  <Link
                    to="/provider/schedule/manage"
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-[var(--color-secondary-700)] bg-[var(--color-secondary-100)] hover:bg-[var(--color-secondary-200)]"
                  >
                    <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Manage Schedule
                  </Link>
                )}
                {user?.role === 'Admin' && (
                  <Link
                    to="/admin/users/create"
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-[var(--color-secondary-700)] bg-[var(--color-secondary-100)] hover:bg-[var(--color-secondary-200)]"
                  >
                    <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Add User
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[var(--color-bg-primary)] border-t border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                <span className="bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-secondary-600)] bg-clip-text text-transparent">Rahati</span> Healthcare
              </h3>
              <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                Providing quality healthcare services with a focus on patient comfort and well-being.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Quick Links</h3>
              <ul className="mt-2 space-y-2">
                <li>
                  <Link to="/" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary-600)]">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/centers" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary-600)]">
                    Healthcare Centers
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary-600)]">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary-600)]">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Contact Us</h3>
              <ul className="mt-2 space-y-2">
                <li className="text-sm text-[var(--color-text-secondary)]">
                  <span className="font-medium">Email:</span> info@rahati.com
                </li>
                <li className="text-sm text-[var(--color-text-secondary)]">
                  <span className="font-medium">Phone:</span> +1 (555) RAHATI
                </li>
                <li className="text-sm text-[var(--color-text-secondary)]">
                  <span className="font-medium">Address:</span> 123 Health Street, Medical District
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-[var(--color-border)] flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-[var(--color-text-tertiary)]">
              &copy; {new Date().getFullYear()} Rahati Healthcare. All rights reserved.
            </p>

            <div className="mt-4 md:mt-0 flex items-center">
              <span className="text-sm text-[var(--color-text-tertiary)]">Made With Love</span>
              <svg className="ml-1 h-5 w-5 text-[var(--color-error)] animate-pulse" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
