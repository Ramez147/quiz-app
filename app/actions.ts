"use server";
import { Redis } from "@upstash/redis";

type VoteResults = Record<string, number>;

function getRedisClient() {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    throw new Error(
      "Redis ist nicht konfiguriert. Setze UPSTASH_REDIS_REST_URL und UPSTASH_REDIS_REST_TOKEN (oder KV_REST_API_URL und KV_REST_API_TOKEN)."
    );
  }

  return new Redis({ url, token });
}

export async function selectOption(option: string) {
  const redis = getRedisClient();
  // Erhöht den Zähler für die gewählte Option um 1
  await redis.hincrby("votes", option, 1);
}

export async function getResults(): Promise<VoteResults> {
  const redis = getRedisClient();
  // Holt alle Stimmen aus der Datenbank
  const results = await redis.hgetall<Record<string, unknown>>("votes");

  if (!results) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(results).map(([key, value]) => [key, Number(value ?? 0)])
  );
}