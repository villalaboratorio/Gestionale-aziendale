import { LogLevel, LogEntry, ILogger } from '../../types';
import { eventBus } from '../../events';
import { EventType } from '../../types';import { configManager } from '../../config';

class Logger implements ILogger {
  private static instance: Logger;
  private logEntries: LogEntry[] = [];

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context,
      moduleId: context?.moduleId as string
    };

    this.logEntries.push(entry);
    eventBus.emit('log:new', entry, EventType.DATA);

    if (configManager.get('logging').enabled) {
      console[level](message, context);
    }
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    this.log(LogLevel.ERROR, message, { ...context, error });
  }

  getLogEntries(): ReadonlyArray<LogEntry> {
    return [...this.logEntries];
  }

  clearLogs(): void {
    this.logEntries = [];
    eventBus.emit('log:cleared', null, EventType.INFO);
  }
}

export const logger = Logger.getInstance();
