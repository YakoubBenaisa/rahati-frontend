import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore, useNotificationStore } from '../store';
import { ThemeToggle } from '../components/ui';

interface PatientDashboardLayoutProps {
  children: React.ReactNode;
}

const PatientDashboardLayout: React.FC<PatientDashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuthStore();
  const { notifications, unreadCount } = useNotificationStore();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
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

  const navigationItems = [
    { 
      name: 'Dashboard', 
      path: '/patient/dashboard',
      icon: (
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    { 
      name: 'Appointments', 
      path: '/patient/appointments',
      icon: (
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      name: 'Consultations', 
      path: '/patient/consultations',
      icon: (
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    },
    { 
      name: 'Accommodations', 
      path: '/patient/accommodations',
      icon: (
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    { 
      name: 'Transportation', 
      path: '/patient/transportation',
      icon: (
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      )
    },
    { 
      name: 'Payments', 
      path: '/patient/payments',
      icon: (
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    },
    { 
      name: 'Feedback', 
      path: '/patient/feedback',
      icon: (
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      )
    },
    { 
      name: 'Settings', 
      path: '/patient/settings',
      icon: (
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)]">
      {/* Sidebar for desktop */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-[var(--color-bg-primary)] border-r border-[var(--color-border)] transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-[var(--color-border)]">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-secondary-600)] bg-clip-text text-transparent">Rahati</span>
              <span className="ml-1 text-xs text-[var(--color-text-tertiary)]">Healthcare</span>
            </Link>
            <button
              className="lg:hidden p-2 rounded-md text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]"
              onClick={toggleSidebar}
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Sidebar content */}
          <div className="flex-1 overflow-y-auto py-4 px-3">
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    location.pathname === item.path
                      ? 'text-[var(--color-primary-600)] bg-[var(--color-primary-50)]'
                      : 'text-[var(--color-text-primary)] hover:text-[var(--color-primary-600)] hover:bg-[var(--color-bg-tertiary)]'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar footer */}
          <div className="p-4 border-t border-[var(--color-border)]">
            <Link
              to="/"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-[var(--color-text-primary)] hover:text-[var(--color-primary-600)] hover:bg-[var(--color-bg-tertiary)]"
            >
              <svg className="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile sidebar backdrop */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleMobileSidebar}
        ></div>
      )}

      {/* Mobile sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-[var(--color-bg-primary)] border-r border-[var(--color-border)] transform transition-transform duration-300 ease-in-out ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:hidden`}
      >
        <div className="h-full flex flex-col">
          {/* Mobile sidebar header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-[var(--color-border)]">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-secondary-600)] bg-clip-text text-transparent">Rahati</span>
              <span className="ml-1 text-xs text-[var(--color-text-tertiary)]">Healthcare</span>
            </Link>
            <button
              className="p-2 rounded-md text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]"
              onClick={toggleMobileSidebar}
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mobile sidebar content */}
          <div className="flex-1 overflow-y-auto py-4 px-3">
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    location.pathname === item.path
                      ? 'text-[var(--color-primary-600)] bg-[var(--color-primary-50)]'
                      : 'text-[var(--color-text-primary)] hover:text-[var(--color-primary-600)] hover:bg-[var(--color-bg-tertiary)]'
                  }`}
                  onClick={toggleMobileSidebar}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile sidebar footer */}
          <div className="p-4 border-t border-[var(--color-border)]">
            <Link
              to="/"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-[var(--color-text-primary)] hover:text-[var(--color-primary-600)] hover:bg-[var(--color-bg-tertiary)]"
              onClick={toggleMobileSidebar}
            >
              <svg className="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
        {/* Header */}
        <header className="bg-[var(--color-bg-primary)] shadow-sm sticky top-0 z-10">
          <div className="h-16 px-4 flex items-center justify-between">
            {/* Left side - Mobile menu button and breadcrumb */}
            <div className="flex items-center">
              <button
                className="p-2 rounded-md text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] lg:hidden"
                onClick={toggleMobileSidebar}
              >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <button
                className="hidden lg:block p-2 rounded-md text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]"
                onClick={toggleSidebar}
              >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              {/* Breadcrumb */}
              <div className="ml-4">
                <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">
                  {navigationItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
                </h1>
              </div>
            </div>

            {/* Right side - Theme toggle, notifications, profile */}
            <div className="flex items-center space-x-4">
              {/* Theme toggle */}
              <ThemeToggle />
              
              {/* Notifications */}
              <div className="relative">
                <button
                  type="button"
                  className="p-2 rounded-full text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]"
                  onClick={toggleNotifications}
                >
                  <span className="sr-only">View notifications</span>
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>

                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-[var(--color-error)] ring-2 ring-[var(--color-bg-primary)]" />
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
                          to="/patient/notifications"
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
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center max-w-xs rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
                  onClick={toggleProfileMenu}
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[var(--color-primary-600)] to-[var(--color-secondary-600)] text-white flex items-center justify-center shadow-md">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
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
                        to="/patient/profile"
                        className="block px-4 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Your Profile
                      </Link>

                      <Link
                        to="/patient/settings"
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
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="p-4 md:p-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-[var(--color-bg-primary)] border-t border-[var(--color-border)] py-4 px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-[var(--color-text-tertiary)]">
              &copy; {new Date().getFullYear()} Rahati Healthcare. All rights reserved.
            </p>
            <div className="mt-2 md:mt-0 flex items-center">
              <Link to="/help" className="text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-primary-600)] mr-4">
                Help
              </Link>
              <Link to="/privacy" className="text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-primary-600)] mr-4">
                Privacy
              </Link>
              <Link to="/terms" className="text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-primary-600)]">
                Terms
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default PatientDashboardLayout;
