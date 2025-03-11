export interface Plugin {
    name: string;
    version: string;
    initialize(): Promise<void>;
    destroy(): Promise<void>;
  }
  
  export interface PluginMetadata {
    enabled: boolean;
    loadedAt: Date;
    dependencies: string[];
  }
  