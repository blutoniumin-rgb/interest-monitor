"use client";

import useSWR from "swr";
import type { DealDetail, Feed } from "./types";

const POLL_MS = 3000;

export function useFeed(fallbackData?: Feed) {
  return useSWR<Feed>("/api/feed", { fallbackData, refreshInterval: POLL_MS, keepPreviousData: true });
}

export function useDeal(id: string, fallbackData?: DealDetail) {
  return useSWR<DealDetail>(`/api/deals/${id}`, { fallbackData, refreshInterval: POLL_MS });
}
