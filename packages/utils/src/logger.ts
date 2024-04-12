import pino, { LoggerOptions } from 'pino';

const isProd = process.env.NODE_ENV === 'production';

const getLoggerOptions = (): LoggerOptions => {
  if (typeof window !== 'undefined') {
    // Browser environment
    const urlParams = new URLSearchParams(window.location.search);
    const isDebugWeb = urlParams.get('debug') === 'web';

    return {
      level: 'info',
      browser: {
        asObject: true,
        serialize: true,
        disabled: !isDebugWeb,
      },
    };
  } else {
    // Node.js environment
    return {
      level: 'info',
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: !isProd,
          translateTime: 'HH:MM:ss.l',
          ignore: 'pid,hostname',
        },
      },
    };
  }
};

export const log = pino(getLoggerOptions());
