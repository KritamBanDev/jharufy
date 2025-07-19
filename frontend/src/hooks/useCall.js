import { useContext } from 'react';
import CallContext from '../contexts/CallContext';

const useCall = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error('useCall must be used within a CallProvider');
  }
  return context;
};

export default useCall;
