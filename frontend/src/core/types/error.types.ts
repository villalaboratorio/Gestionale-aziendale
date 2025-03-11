export enum ErrorSeverity {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical'
  }
  
  export interface AppError extends Error {
    code: string;
    severity: ErrorSeverity;
    context?: Record<string, unknown>;
    timestamp: Date;
  }
  
  export interface ErrorHandler {
    handle(error: AppError): void;
  }
  