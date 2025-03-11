export interface ConfigOptions {
    environment: 'development' | 'production' | 'test';
    apiUrl: string;
    features: Record<string, boolean>;
    logging: {
      level: 'debug' | 'info' | 'warn' | 'error';
      enabled: boolean;
    };
  }
  