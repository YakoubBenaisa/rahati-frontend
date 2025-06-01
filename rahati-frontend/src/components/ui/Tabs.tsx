import React, { useState } from 'react';

interface TabsProps {
  children: React.ReactElement[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

interface TabProps {
  id: string;
  label: string;
  children: React.ReactNode;
}

export const Tab: React.FC<TabProps> = ({ children }) => {
  return <>{children}</>;
};

const Tabs: React.FC<TabsProps> = ({ children, activeTab, onChange, className = '' }) => {
  // Filter out non-Tab children
  const tabs = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.type === Tab
  ) as React.ReactElement[];

  // Get active tab content
  //const activeTabContent = tabs.find((tab) => (tab.props as TabProps).id === activeTab)?.props.children;

  return (
    <div className={className}>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const tabElement = tab as React.ReactElement<TabProps>;
            const isActive = tabElement.props.id === activeTab;
            return (
              <button
                key={tabElement.props.id}
                onClick={() => onChange(tabElement.props.id)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${
                    isActive
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
                aria-current={isActive ? 'page' : undefined}
              >
                {tabElement.props.label}
              </button>
            );
          })}
        </nav>
      </div>
     {/* <div className="py-6">{activeTabContent}</div>*/}
    </div>
  );
};

export default Tabs;
