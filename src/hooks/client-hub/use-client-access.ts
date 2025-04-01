
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { validateClientToken } from '@/utils/client-service';

/**
 * Hook that handles client token validation and access control
 */
export function useClientAccess() {
  const location = useLocation();
  const [clientToken, setClientToken] = useState<string | null>(null);
  const [designerId, setDesignerId] = useState<string | null>(null);
  const [isValidatingAccess, setIsValidatingAccess] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('clientToken');
    const dId = urlParams.get('designerId');

    // Reset error state on new parameters
    setError(null);

    if (!token || !dId) {
      setAccessDenied(true);
      setIsValidatingAccess(false);
      setError(new Error('Missing required parameters: clientToken or designerId'));
      return;
    }

    setClientToken(token);
    setDesignerId(dId);

    const validateAccess = async () => {
      setIsValidatingAccess(true);
      try {
        const isValid = await validateClientToken(token, dId);
        if (!isValid) {
          setAccessDenied(true);
          toast.error("This link is invalid or has expired.");
          setError(new Error('Invalid or expired client token'));
        }
      } catch (error) {
        console.error("Error validating client access:", error);
        setAccessDenied(true);
        toast.error("Unable to validate your access. Please try again later.");
        setError(error instanceof Error ? error : new Error('Unknown error validating access'));
      } finally {
        setIsValidatingAccess(false);
      }
    };

    validateAccess();
  }, [location.search]);

  return {
    clientToken,
    designerId,
    isValidatingAccess,
    accessDenied,
    error
  };
}
