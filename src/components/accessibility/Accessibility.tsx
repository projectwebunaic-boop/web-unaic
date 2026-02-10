'use client';

import React from 'react';
import { AccessibilityProvider } from './useAccessibility';
import AccessibilityPanel from './AccessibilityPanel';

const Accessibility: React.FC = () => {
  return (
    <AccessibilityProvider>
      <AccessibilityPanel />
    </AccessibilityProvider>
  );
};

export default Accessibility;
