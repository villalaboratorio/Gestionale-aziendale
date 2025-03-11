import { Plugin, PluginMetadata } from '../types';
import { eventBus } from '../events';
import { EventType } from '../types';
class PluginManager {
  private plugins: Map<string, Plugin>;
  private metadata: Map<string, PluginMetadata>;
  private static instance: PluginManager;

  private constructor() {
    this.plugins = new Map();
    this.metadata = new Map();
  }

  static getInstance(): PluginManager {
    if (!PluginManager.instance) {
      PluginManager.instance = new PluginManager();
    }
    return PluginManager.instance;
  }

  async register(plugin: Plugin): Promise<void> {
    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin ${plugin.name} already registered`);
    }

    this.plugins.set(plugin.name, plugin);
    this.metadata.set(plugin.name, {
      enabled: false,
      loadedAt: new Date(),
      dependencies: []
    });

    eventBus.emit('plugin:registered', { plugin: plugin.name }, EventType.INFO);
  }

  async initialize(pluginName: string): Promise<void> {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) {
      throw new Error(`Plugin ${pluginName} not found`);
    }

    await plugin.initialize();
    this.metadata.get(pluginName)!.enabled = true;
    
    eventBus.emit('plugin:initialized', { plugin: pluginName }, EventType.INFO);
  }

  getPlugin<T extends Plugin>(name: string): T {
    const plugin = this.plugins.get(name) as T;
    if (!plugin) {
      throw new Error(`Plugin ${name} not found`);
    }
    return plugin;
  }
}

export const pluginManager = PluginManager.getInstance();
