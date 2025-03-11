import { ICache, CacheOptions, CacheEntry } from '../../types';
import { eventBus } from '../../events';
import { EventType } from '../../types';
class CacheManager implements ICache {
  private static instance: CacheManager;
  private store: Map<string, CacheEntry<unknown>>;

  private constructor() {
    this.store = new Map();
  }

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  set<T>(key: string, data: T, options: CacheOptions = { ttl: 3600000 }): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expires: Date.now() + options.ttl,
      tags: options.tags || []
    };

    this.store.set(key, entry as CacheEntry<unknown>);
    eventBus.emit('cache:set', { key, tags: options.tags }, EventType.INFO);
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key) as CacheEntry<T>;
    
    if (!entry) return null;
    if (Date.now() > entry.expires) {
      this.delete(key);
      return null;
    }

    return entry.data;
  }

  has(key: string): boolean {
    return this.store.has(key);
  }

  delete(key: string): void {
    this.store.delete(key);
    eventBus.emit('cache:deleted', { key }, EventType.INFO);
  }

  clear(): void {
    this.store.clear();
    eventBus.emit('cache:cleared', null, EventType.INFO);
  }

  clearByTag(tag: string): void {
    Array.from(this.store.entries()).forEach(([key, entry]) => {
      if (entry.tags.includes(tag)) {
        this.delete(key);
      }
    });
    
    eventBus.emit('cache:clearedByTag', { tag }, EventType.INFO);
  }
}

export const cacheManager = CacheManager.getInstance();
