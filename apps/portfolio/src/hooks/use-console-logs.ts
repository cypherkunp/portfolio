import { useEffect } from 'react';

// enables console.log, console.warn, and console.debug when the query parameter ?debug=enable is present
export const useConsoleLogs = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const debugParam = urlParams.get('debug');

    if (debugParam !== 'enable') {
      console.log('Console logs are disabled. To enable, add ?debug=enable to the URL.');
      // Override console.log, console.warn, and console.debug to disable logging
      const originalConsoleLog = console.log;
      const originalConsoleWarn = console.warn;
      const originalConsoleDebug = console.debug;

      console.log = function () {};
      console.warn = function () {};
      console.debug = function () {};

      return () => {
        console.log = originalConsoleLog;
        console.warn = originalConsoleWarn;
        console.debug = originalConsoleDebug;
      };
    }
  }, []);
};
