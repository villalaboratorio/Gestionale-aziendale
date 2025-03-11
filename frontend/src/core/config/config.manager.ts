import { ConfigOptions } from '../types';
import { eventBus } from '../events';
import { EventType } from '../types';
class ConfigManager {
  private static instance: ConfigManager;
  private config: ConfigOptions;

  private constructor() {
    this.config = this.getDefaultConfig();
  }

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  private getDefaultConfig(): ConfigOptions {
    return {
      environment: 'development',
      apiUrl: 'http://localhost:3000',
      features: {},
      logging: {
        level: 'info',
        enabled: true
      }
    };
  }

  set(options: Partial<ConfigOptions>): void {
    this.config = {
      ...this.config,
      ...options
    };
    eventBus.emit('config:updated', { config: this.config }, EventType.INFO);
  }

  get<K extends keyof ConfigOptions>(key: K): ConfigOptions[K] {
    return this.config[key];
  }

  getAll(): Readonly<ConfigOptions> {
    return Object.freeze({ ...this.config });
  }
}

export const configManager = ConfigManager.getInstance();
