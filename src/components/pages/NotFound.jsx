import React from 'react';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="p-4 bg-gray-100 rounded-full">
            <ApperIcon name="AlertTriangle" size={48} className="text-gray-600" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">404</h1>
          <h2 className="text-xl font-semibold text-gray-700">Page Not Found</h2>
          <p className="text-gray-600">Sorry, the page you're looking for doesn't exist or has been moved.</p>
        </div>
        <Button onClick={handleGoHome} className="inline-flex items-center space-x-2">
          <ApperIcon name="Home" size={16} />
          <span>Go Back Home</span>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;