import { LRUCache } from 'lru-cache';

const options = {
    max: 500,
    ttl: 60000, // 1 minute
};

const tokenCache = new LRUCache(options);

export function rateLimit(limit: number, windowMs: number) {
    return {
        check: (token: string) => {
            const tokenCount = (tokenCache.get(token) as number[]) || [0];
            if (tokenCount[0] === 0) {
                tokenCache.set(token, [1]);
            } else {
                tokenCount[0] += 1;
                tokenCache.set(token, tokenCount);
            }

            const currentUsage = tokenCount[0];
            const isRateLimited = currentUsage > limit;

            return {
                isRateLimited,
                currentUsage,
                limit,
                remaining: isRateLimited ? 0 : limit - currentUsage,
            };
        },
    };
}
