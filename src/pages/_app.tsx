import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { SWRConfig } from 'swr';
import ErrorBoundary from '../components/ui/ErrorBoundary';
import fetcher from '../utils/swrFetcher';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Force light mode
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
  }, []);
  
  return (
    <ErrorBoundary>
      <SWRConfig 
        value={{
          fetcher: fetcher,
          revalidateOnFocus: false,
          revalidateIfStale: false,
          revalidateOnReconnect: false,
          dedupingInterval: 600000, // 10 minutes
          errorRetryCount: 3,
          suspense: false,
          // Adding a global onError handler
          onError: (error, key) => {
            console.error(`SWR Error fetching ${key}:`, error);
          }
        }}
      >
        <Component {...pageProps} />
      </SWRConfig>
    </ErrorBoundary>
  );
}

export default MyApp;
