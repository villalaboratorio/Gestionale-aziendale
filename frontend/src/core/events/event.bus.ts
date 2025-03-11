import { IEventBus, EventHandler, EventType, EventPayload } from '../types';

class EventBus implements IEventBus {
  private handlers: Map<string, Set<EventHandler>>;
  private static instance: EventBus;
  private eventLog: Array<{
    type: string,
    eventType: EventType,
    payload: unknown,
    timestamp: Date
  }>;

  private constructor() {
    this.handlers = new Map();
    this.eventLog = [];
  }

  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  emit<T>(eventName: string, payload: EventPayload<T>, eventType: EventType = EventType.INFO): void {
    this.eventLog.push({
      type: eventName,
      eventType,
      payload,
      timestamp: new Date()
    });

    const handlers = this.handlers.get(eventName);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(payload);
        } catch (error) {
          this.emit('error', error, EventType.ERROR);
        }
      });
    }
  }

  on<T>(eventName: string, handler: EventHandler<T>): void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, new Set());
    }
    this.handlers.get(eventName)?.add(handler);
  }

  off<T>(eventName: string, handler: EventHandler<T>): void {
    const handlers = this.handlers.get(eventName);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.handlers.delete(eventName);
      }
    }
  }

  getEventLog() {
    return [...this.eventLog];
  }

  clearEventLog() {
    this.eventLog = [];
  }
}

export const eventBus = EventBus.getInstance();
