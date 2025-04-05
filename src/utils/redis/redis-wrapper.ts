
import { createClient, RedisClientType } from 'redis';

// Configure Redis connection options
const redisUrl = typeof window === 'undefined' 
  ? process.env.REDIS_URL || 'redis://localhost:6379' 
  : '';

export class RedisWrapper {
  private static instance: RedisWrapper;
  private client: RedisClientType | null = null;
  private isConnected: boolean = false;
  private isClient: boolean;

  private constructor() {
    this.isClient = typeof window !== 'undefined';
    
    // Only initialize Redis client on the server
    if (!this.isClient && redisUrl) {
      this.initializeClient();
    } else {
      console.log('Redis client not initialized in browser environment');
    }
  }

  private async initializeClient(): Promise<void> {
    if (this.isClient) return; // Safety check
    
    try {
      this.client = createClient({ url: redisUrl });
      
      this.client.on('error', (err) => {
        console.error('Redis Client Error:', err);
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        console.log('Connected to Redis');
        this.isConnected = true;
      });

      await this.client.connect();
    } catch (error) {
      console.error('Failed to initialize Redis client:', error);
      this.client = null;
    }
  }

  // Singleton pattern to ensure only one instance
  public static getInstance(): RedisWrapper {
    if (!RedisWrapper.instance) {
      RedisWrapper.instance = new RedisWrapper();
    }
    return RedisWrapper.instance;
  }

  // Check if connected
  public isClientConnected(): boolean {
    return !this.isClient && this.isConnected;
  }

  // Basic operations
  async get(key: string): Promise<string | null> {
    if (!this.client || this.isClient) return null;
    try {
      return await this.client.get(key);
    } catch (error) {
      console.error(`Error getting key ${key}:`, error);
      return null;
    }
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<boolean> {
    if (!this.client || this.isClient) return false;
    try {
      if (ttlSeconds) {
        await this.client.set(key, value, { EX: ttlSeconds });
      } else {
        await this.client.set(key, value);
      }
      return true;
    } catch (error) {
      console.error(`Error setting key ${key}:`, error);
      return false;
    }
  }

  async del(key: string): Promise<boolean> {
    if (!this.client || this.isClient) return false;
    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      console.error(`Error deleting key ${key}:`, error);
      return false;
    }
  }

  // Cache specific methods 
  async cacheData<T>(key: string, data: T, ttlSeconds: number = 3600): Promise<boolean> {
    if (!this.client || this.isClient) return false;
    try {
      const serializedData = JSON.stringify(data);
      return await this.set(key, serializedData, ttlSeconds);
    } catch (error) {
      console.error(`Error caching data for key ${key}:`, error);
      return false;
    }
  }

  async getCachedData<T>(key: string): Promise<T | null> {
    if (!this.client || this.isClient) return null;
    try {
      const data = await this.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (error) {
      console.error(`Error getting cached data for key ${key}:`, error);
      return null;
    }
  }

  // Analytics specific methods
  async incrementCounter(key: string, increment: number = 1): Promise<number | null> {
    if (!this.client || this.isClient) return null;
    try {
      return await this.client.incrBy(key, increment);
    } catch (error) {
      console.error(`Error incrementing counter ${key}:`, error);
      return null;
    }
  }

  async getCounters(pattern: string): Promise<Record<string, number>> {
    if (!this.client || this.isClient) return {};
    try {
      const keys = await this.client.keys(pattern);
      const result: Record<string, number> = {};
      
      for (const key of keys) {
        const value = await this.get(key);
        if (value !== null) {
          result[key] = parseInt(value, 10);
        }
      }
      
      return result;
    } catch (error) {
      console.error(`Error getting counters with pattern ${pattern}:`, error);
      return {};
    }
  }

  // AI memory caching
  async cacheEmbedding(key: string, embedding: number[], ttlSeconds: number = 86400): Promise<boolean> {
    if (!this.client || this.isClient) return false;
    try {
      const serializedEmbedding = JSON.stringify(embedding);
      return await this.set(`embedding:${key}`, serializedEmbedding, ttlSeconds);
    } catch (error) {
      console.error(`Error caching embedding for key ${key}:`, error);
      return false;
    }
  }

  async getCachedEmbedding(key: string): Promise<number[] | null> {
    if (!this.client || this.isClient) return null;
    try {
      const data = await this.get(`embedding:${key}`);
      if (!data) return null;
      return JSON.parse(data) as number[];
    } catch (error) {
      console.error(`Error getting cached embedding for key ${key}:`, error);
      return null;
    }
  }

  // Close connection
  async disconnect(): Promise<void> {
    if (this.client && !this.isClient) {
      await this.client.disconnect();
      this.isConnected = false;
    }
  }
}

// Export a singleton instance
export const redisClient = RedisWrapper.getInstance();
