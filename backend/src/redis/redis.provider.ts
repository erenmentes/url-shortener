import Redis from "ioredis";

export const RedisProvider = {
  provide: "REDIS",
  useFactory: () => {
    return new Redis({
      host: "localhost",
      port: 6379,
    });
  },
};