import { useCallback, useRef } from 'react';

/**
 * A hook that returns a memoized callback that doesn't change unless one of its dependencies changes.
 * Also ensures that the latest function implementation is always used.
 * 
 * This is useful for callbacks that are passed to child components to prevent unnecessary re-renders.
 * 
 * @param callback The callback function to memoize
 * @param deps The dependencies array for the callback
 * @returns A memoized callback that doesn't change unless one of its dependencies changes
 */
function useStableCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList = []
): T {
  const callbackRef = useRef<T>(callback);
  
  // Update ref to latest callback
  callbackRef.current = callback;
  
  // Create a stable callback that calls the latest implementation
  return useCallback(
    ((...args: any[]) => callbackRef.current(...args)) as T,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps
  );
}

export default useStableCallback;
