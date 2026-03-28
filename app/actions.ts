"use server";
import { kv } from "@vercel/kv";

export async function selectOption(option: string) {
  // Erhöht den Zähler für die gewählte Option um 1
  await kv.hincrby("votes", option, 1);
}

export async function getResults() {
  // Holt alle Stimmen aus der Datenbank
  const results = await kv.hgetall("votes");
  return results || {};
}