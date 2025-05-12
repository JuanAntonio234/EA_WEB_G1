import React, { useState, ReactNode } from 'react';
import './Tabs.css';

interface TabProps {
  label: string;
  children: ReactNode;
}

export const Tab: React.FC<TabProps> = ({ children }) => {
  return <div className="tab-content">{children}</div>;
};

interface TabsProps {
  children: React.ReactElement<TabProps> | React.ReactElement<TabProps>[];
}

const Tabs: React.FC<TabsProps> = ({ children }) => {
  const tabsArray = React.Children.toArray(children) as React.ReactElement<TabProps>[];
  const [activeTab, setActiveTab] = useState(0);

  if (tabsArray.length === 0) {
    return null;
  }

  return (
    <div className="tabs-container">
      <div className="tabs-header">
        {tabsArray.map((tab, index) => (
          <button
            key={index}
            className={`tab-button ${index === activeTab ? 'active' : ''}`}
            onClick={() => setActiveTab(index)}
          >
            {tab.props.label}
          </button>
        ))}
      </div>
      <div className="tabs-content-area">
        {tabsArray[activeTab]}
      </div>
    </div>
  );
};

export default Tabs;