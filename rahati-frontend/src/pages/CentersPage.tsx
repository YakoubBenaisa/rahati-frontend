import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MainLayout } from '../layouts';
import { Card, Button, Badge, Input } from '../components/ui';
import { useCenterStore } from '../store/centerStore';
import { Center } from '../types';

const CentersPage: React.FC = () => {
  const { centers, fetchCenters, isLoading, error } = useCenterStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCenters, setFilteredCenters] = useState<Center[]>([]);
  
  useEffect(() => {
    fetchCenters({ is_active: true });
  }, [fetchCenters]);
  
  useEffect(() => {
    if (centers.length > 0) {
      const filtered = centers.filter(center => 
        center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        center.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        center.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCenters(filtered);
    }
  }, [centers, searchTerm]);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  
  return (
    <MainLayout>
      <div className="mb-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-900"
        >
          Healthcare Centers
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-600"
        >
          Find and explore healthcare centers in our network.
        </motion.p>
      </div>
      
      {/* Search and filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <Input
                type="text"
                placeholder="Search by name, description, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
                className="mb-0"
              />
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Centers list */}
      {isLoading ? (
        <div className="text-center py-12">
          <svg className="animate-spin h-12 w-12 text-primary-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-gray-600">Loading healthcare centers...</p>
        </div>
      ) : error ? (
        <Card className="bg-red-50 border border-red-200">
          <p className="text-red-600">{error}</p>
          <Button
            variant="primary"
            className="mt-4"
            onClick={() => fetchCenters({ is_active: true })}
          >
            Try Again
          </Button>
        </Card>
      ) : filteredCenters.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No healthcare centers found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'No centers match your search criteria. Try a different search term.' : 'There are no healthcare centers available at the moment.'}
            </p>
            {searchTerm && (
              <Button
                variant="primary"
                onClick={() => setSearchTerm('')}
              >
                Clear Search
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredCenters.map((center) => (
            <motion.div key={center.id} variants={itemVariants}>
              <Card className="h-full">
                <div className="flex flex-col h-full">
                  <div className="mb-4">
                    <Badge variant="primary" className="mb-2">Healthcare Center</Badge>
                    <h3 className="text-xl font-semibold text-gray-900">{center.name}</h3>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">{center.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-start">
                      <svg className="h-5 w-5 text-gray-400 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-gray-600">{center.address}</span>
                    </div>
                    
                    <div className="flex items-start">
                      <svg className="h-5 w-5 text-gray-400 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-gray-600">{center.phone}</span>
                    </div>
                    
                    <div className="flex items-start">
                      <svg className="h-5 w-5 text-gray-400 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-600">{center.email}</span>
                    </div>
                    
                    {center.website && (
                      <div className="flex items-start">
                        <svg className="h-5 w-5 text-gray-400 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                        <a href={center.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <Button
                      as={Link}
                      to={`/centers/${center.id}`}
                      variant="primary"
                      fullWidth
                    >
                      View Center Details
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </MainLayout>
  );
};

export default CentersPage;
