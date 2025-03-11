// Definiamo un tipo generico per i payload degli eventi
export type EventPayload<T = unknown> = T;

// Handler tipizzato
export type EventHandler<T = unknown> = (payload: EventPayload<T>) => void;

// Interfaccia EventBus con generics
export interface IEventBus {
  emit<T>(eventName: string, payload: EventPayload<T>): void;
  on<T>(eventName: string, handler: EventHandler<T>): void;
  off<T>(eventName: string, handler: EventHandler<T>): void;
}

export type EventSubscription = {
  unsubscribe: () => void;
}

// Enum per i tipi di eventi supportati
export enum EventType {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  DATA = 'data'
}
