import axios from 'axios';

// The fetcher function for SWR
const fetcher = async (url: string) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    // Enhance error handling for SWR
    if (axios.isAxiosError(error)) {
      const serverError = error.response?.data;
      throw new Error(serverError?.message || 'An unexpected error occurred');
    }
    throw error;
  }
};

export default fetcher;
