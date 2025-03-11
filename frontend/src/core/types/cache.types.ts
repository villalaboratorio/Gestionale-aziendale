export interface CacheOptions {
    ttl: number;  // Time to live in milliseconds
    namespace?: string;
    tags?: string[];
  }
  
  export interface CacheEntry<T> {
    data: T;
    timestamp: number;
    expires: number;
    tags: string[];
  }
  
  export interface ICache {
    set<T>(key: string, data: T, options?: CacheOptions): void;
    get<T>(key: string): T | null;
    has(key: string): boolean;
    delete(key: string): void;
    clear(): void;
    clearByTag(tag: string): void;
  }
  