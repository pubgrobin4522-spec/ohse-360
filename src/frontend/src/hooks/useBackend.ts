import { useActor } from "@caffeineai/core-infrastructure";
import { useCallback } from "react";
import { createActor } from "../backend";
import type { backendInterface } from "../backend";
import { useAuth } from "./useAuth";

/**
 * Returns the raw backend actor + the current session token.
 * All calls go through actor.method(token, ...args).
 */
export function useBackend(): {
  actor: backendInterface | null;
  token: string | null;
  isReady: boolean;
} {
  const { actor, isFetching } = useActor(createActor);
  const { user } = useAuth();

  return {
    actor: actor as backendInterface | null,
    token: user?.sessionToken ?? null,
    isReady: !isFetching && actor !== null,
  };
}

/**
 * Convenience: call a backend method with the session token injected.
 * Returns { call } — a stable function that throws on backend error.
 */
export function useBackendCall() {
  const { actor, token } = useBackend();

  const call = useCallback(
    async <T>(
      fn: (actor: backendInterface, token: string) => Promise<T>,
    ): Promise<T> => {
      if (!actor || !token) throw new Error("Not authenticated");
      return fn(actor, token);
    },
    [actor, token],
  );

  return { call };
}
