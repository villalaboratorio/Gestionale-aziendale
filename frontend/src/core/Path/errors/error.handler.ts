import { ErrorHandler, AppError, ErrorSeverity } from '../../types';
import { logger } from '../logging';
import { eventBus } from '../../events';
import { EventType } from '../../types';
class GlobalErrorHandler implements ErrorHandler {
  private static instance: GlobalErrorHandler;
  private errorLog: AppError[] = [];

  private constructor() {}

  static getInstance(): GlobalErrorHandler {
    if (!GlobalErrorHandler.instance) {
      GlobalErrorHandler.instance = new GlobalErrorHandler();
    }
    return GlobalErrorHandler.instance;
  }

  handle(error: AppError): void {
    // Aggiungi al log interno
    this.errorLog.push(error);

    // Log tramite logger
    logger.error(error.message, error as Error, {
      code: error.code,
      severity: error.severity,
      context: error.context
    });

    // Emetti evento con tipo corretto
    eventBus.emit<AppError>('error:occurred', error, EventType.ERROR);

    // Gestisci in base alla severità
    switch (error.severity) {
      case ErrorSeverity.CRITICAL:
        this.handleCriticalError(error);
        break;
      case ErrorSeverity.HIGH:
        this.handleHighSeverityError(error);
        break;
      default:
        this.handleStandardError(error);
    }
  }

  private handleCriticalError(error: AppError): void {
    eventBus.emit('error:critical', error, EventType.ERROR);
  }

  private handleHighSeverityError(error: AppError): void {
    eventBus.emit('error:high', error, EventType.ERROR);
  }

  private handleStandardError(error: AppError): void {
    eventBus.emit('error:standard', error, EventType.ERROR);
  }

  getErrorLog(): ReadonlyArray<AppError> {
    return [...this.errorLog];
  }
}

export const errorHandler = GlobalErrorHandler.getInstance();
