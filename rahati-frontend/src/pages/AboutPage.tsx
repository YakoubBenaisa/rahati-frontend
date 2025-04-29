import React from 'react';
import { MainLayout } from '../layouts';
import { motion } from 'framer-motion';

const AboutPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-6">
            About Rahati Healthcare
          </h1>
          
          <div className="bg-[var(--color-bg-primary)] rounded-lg shadow-md p-6 mb-8 border border-[var(--color-border)]">
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">Our Mission</h2>
            <p className="text-[var(--color-text-secondary)] mb-4">
              At Rahati Healthcare, our mission is to provide accessible, high-quality healthcare services 
              to all patients, with a focus on comfort, convenience, and comprehensive care. We believe that 
              healthcare should be a seamless experience, from finding the right provider to managing 
              accommodations and transportation.
            </p>
            <p className="text-[var(--color-text-secondary)]">
              We are committed to leveraging technology to improve healthcare access and outcomes, 
              while maintaining the human touch that is essential to healing and wellness.
            </p>
          </div>
          
          <div className="bg-[var(--color-bg-primary)] rounded-lg shadow-md p-6 mb-8 border border-[var(--color-border)]">
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">Our Story</h2>
            <p className="text-[var(--color-text-secondary)] mb-4">
              Rahati Healthcare was founded in 2023 with a simple yet powerful vision: to create a healthcare 
              platform that addresses the full spectrum of patient needs. Our founders, experienced healthcare 
              professionals and technologists, recognized that many patients face challenges beyond just 
              receiving medical care.
            </p>
            <p className="text-[var(--color-text-secondary)] mb-4">
              Finding suitable accommodations, arranging transportation, and coordinating care across 
              different providers can be overwhelming, especially for those traveling for treatment or 
              managing chronic conditions.
            </p>
            <p className="text-[var(--color-text-secondary)]">
              By creating an integrated platform that connects patients with healthcare providers, 
              accommodations, and transportation services, Rahati Healthcare aims to remove these barriers 
              and make quality healthcare truly accessible to all.
            </p>
          </div>
          
          <div className="bg-[var(--color-bg-primary)] rounded-lg shadow-md p-6 border border-[var(--color-border)]">
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">Our Values</h2>
            <ul className="space-y-4">
              <li>
                <h3 className="text-lg font-medium text-[var(--color-primary-600)]">Patient-Centered Care</h3>
                <p className="text-[var(--color-text-secondary)]">
                  We put patients first in everything we do, designing our services around their needs and preferences.
                </p>
              </li>
              <li>
                <h3 className="text-lg font-medium text-[var(--color-primary-600)]">Accessibility</h3>
                <p className="text-[var(--color-text-secondary)]">
                  We strive to make healthcare accessible to all, regardless of location, mobility, or socioeconomic status.
                </p>
              </li>
              <li>
                <h3 className="text-lg font-medium text-[var(--color-primary-600)]">Innovation</h3>
                <p className="text-[var(--color-text-secondary)]">
                  We continuously seek innovative solutions to improve the healthcare experience.
                </p>
              </li>
              <li>
                <h3 className="text-lg font-medium text-[var(--color-primary-600)]">Integrity</h3>
                <p className="text-[var(--color-text-secondary)]">
                  We operate with transparency, honesty, and the highest ethical standards.
                </p>
              </li>
              <li>
                <h3 className="text-lg font-medium text-[var(--color-primary-600)]">Collaboration</h3>
                <p className="text-[var(--color-text-secondary)]">
                  We believe in the power of collaboration between patients, providers, and communities.
                </p>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default AboutPage;
