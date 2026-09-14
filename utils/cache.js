const Redis = require("ioredis");
const logger = require("./logger");

// Simple In-Memory LRU-style fallback cache
class MemoryCache {
    constructor() {
        this.store = new Map();
    }

    async get(key) {
        const item = this.store.get(key);
        if (!item) return null;
        if (item.expiry && item.expiry < Date.now()) {
            this.store.delete(key);
            return null;
        }
        return item.value;
    }

    async set(key, value, ttlSeconds = 300) {
        const expiry = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
        this.store.set(key, { value, expiry });
        return "OK";
    }

    async del(patternOrKey) {
        if (patternOrKey.includes("*")) {
            const prefix = patternOrKey.replace("*", "");
            for (const key of this.store.keys()) {
                if (key.startsWith(prefix)) {
                    this.store.delete(key);
                }
            }
        } else {
            this.store.delete(patternOrKey);
        }
        return 1;
    }

    async flush() {
        this.store.clear();
        return "OK";
    }
}

let client = null;
const memoryFallback = new MemoryCache();
let useRedis = false;

if (process.env.REDIS_URL || process.env.REDIS_HOST) {
    try {
        client = new Redis(process.env.REDIS_URL || {
            host: process.env.REDIS_HOST || "127.0.0.1",
            port: process.env.REDIS_PORT || 6379,
            password: process.env.REDIS_PASSWORD || undefined,
            maxRetriesPerRequest: 1,
            retryStrategy: () => null, // don't retry endlessly if Redis is down
        });

        client.on("connect", () => {
            logger.info("🟢 Connected to Redis Cache");
            useRedis = true;
        });

        client.on("error", (err) => {
            logger.warn(`🟡 Redis unavailable (${err.message}). Using in-memory fallback cache.`);
            useRedis = false;
        });
    } catch (err) {
        logger.warn(`🟡 Redis init failed: ${err.message}. Using in-memory fallback.`);
    }
} else {
    logger.info("ℹ️ No REDIS_URL configured. Running with in-memory caching engine.");
}

module.exports = {
    async get(key) {
        try {
            if (useRedis && client) {
                const data = await client.get(key);
                return data ? JSON.parse(data) : null;
            }
        } catch (err) {
            logger.warn(`Redis GET error for key ${key}: ${err.message}`);
        }
        return await memoryFallback.get(key);
    },

    async set(key, value, ttlSeconds = 300) {
        try {
            if (useRedis && client) {
                return await client.set(key, JSON.stringify(value), "EX", ttlSeconds);
            }
        } catch (err) {
            logger.warn(`Redis SET error for key ${key}: ${err.message}`);
        }
        return await memoryFallback.set(key, value, ttlSeconds);
    },

    async del(patternOrKey) {
        try {
            if (useRedis && client) {
                if (patternOrKey.includes("*")) {
                    const keys = await client.keys(patternOrKey);
                    if (keys.length > 0) {
                        return await client.del(...keys);
                    }
                    return 0;
                }
                return await client.del(patternOrKey);
            }
        } catch (err) {
            logger.warn(`Redis DEL error for ${patternOrKey}: ${err.message}`);
        }
        return await memoryFallback.del(patternOrKey);
    },

    async flush() {
        try {
            if (useRedis && client) {
                return await client.flushall();
            }
        } catch (err) {
            logger.warn(`Redis FLUSH error: ${err.message}`);
        }
        return await memoryFallback.flush();
    },
};
