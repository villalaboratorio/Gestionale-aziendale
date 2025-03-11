export interface ServiceDefinition<T> {
    name: string;
    factory: () => T;
    singleton?: boolean;
  }
  
  export interface IServiceContainer {
    register<T>(definition: ServiceDefinition<T>): void;
    get<T>(serviceName: string): T;
    has(serviceName: string): boolean;
  }
  