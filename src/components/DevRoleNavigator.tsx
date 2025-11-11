import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.ts';
import { UserRole } from '../types.ts';

const DevRoleNavigator: React.FC = () => {
  const { user, switchUserRole } = useAuth();
  const navigate = useNavigate();

  // Component is disabled for production
  return null;
};

export default DevRoleNavigator;
