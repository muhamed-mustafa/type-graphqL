import Redis from 'ioredis';

export const redis = new Redis({
  host: String(process.env.REDIS_HOST),
  port: Number(process.env.REDIS_PORT),
});
