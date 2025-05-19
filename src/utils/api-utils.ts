
/**
 * Utility function to handle common API error responses
 * 
 * @param response The fetch Response object
 * @returns The response if it's ok, otherwise throws an error
 */
export const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    if (response.status === 401) {
      console.warn('Authentication failed: Token may be invalid or expired');
      // Clear the invalid token
      localStorage.removeItem('auth_token');
    }
    throw new Error(`API error: ${response.status}`);
  }
  
  return {
    data: await response.json(),
    status: response.status,
  };
};

/**
 * Generates authorization headers with the current auth token
 */
export const getAuthHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
  };
};
