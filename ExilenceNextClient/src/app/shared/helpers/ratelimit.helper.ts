import RateLimiter from "rxjs-ratelimiter";

export class RatelimitHelper {
    public static updateRatelimit(requestCount: number, milliseconds: number) {
        return new RateLimiter(requestCount, milliseconds);
    }
}
