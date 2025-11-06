
import React from 'react';

const LoadingSpinner: React.FC<{ size?: string }> = ({ size = '8' }) => {
  return (
    <div className={`w-${size} h-${size} border-4 border-gemini-grey border-t-gemini-blue rounded-full animate-spin`}></div>
  );
};

export default LoadingSpinner;
