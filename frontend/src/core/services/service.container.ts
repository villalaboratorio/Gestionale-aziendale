import { IServiceContainer, ServiceDefinition } from '../types';
import { StorageService } from '../../features/pianificazione/services/storage.service';

// Aggiungiamo un generic type per i servizi
class ServiceContainer implements IServiceContainer {
  private services: Map<string, ServiceDefinition<unknown>>;
  private instances: Map<string, unknown>;
  private static instance: ServiceContainer;

  private constructor() {
    this.services = new Map();
    this.instances = new Map();
    
    // Registriamo subito lo StorageService per garantire la retrocompatibilità
    this.registerStorageService();
  }

  static getInstance(): ServiceContainer {
    if (!ServiceContainer.instance) {
      ServiceContainer.instance = new ServiceContainer();
    }
    return ServiceContainer.instance;
  }

  // Metodo privato per registrare lo StorageService
  private registerStorageService(): void {
    const storageServiceDefinition: ServiceDefinition<StorageService> = {
      name: 'storageService',
      singleton: true,
      factory: () => new StorageService()
    };
    
    this.services.set(storageServiceDefinition.name, storageServiceDefinition);
    // Pre-istanziamo anche il servizio per garantire che sia immediatamente disponibile
    this.instances.set(storageServiceDefinition.name, new StorageService());
  }

  register<T>(definition: ServiceDefinition<T>): void {
    this.services.set(definition.name, definition);
    // Rimuoviamo la riga problematica che usa this.container
    // this.container.set('storageService', new StorageService());
  }

  get<T>(serviceName: string): T {
    if (!this.services.has(serviceName)) {
      throw new Error(`Service ${serviceName} not found`);
    }

    const definition = this.services.get(serviceName) as ServiceDefinition<T>;

    if (definition.singleton) {
      if (!this.instances.has(serviceName)) {
        this.instances.set(serviceName, definition.factory());
      }
      return this.instances.get(serviceName) as T;
    }

    return definition.factory();
  }

  has(serviceName: string): boolean {
    return this.services.has(serviceName);
  }
}

export const serviceContainer = ServiceContainer.getInstance();
