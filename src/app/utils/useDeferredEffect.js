"use client";
import { useEffect } from "react";

/**
 * Like useEffect, but runs `fn` in a microtask instead of synchronously inside
 * the effect body. Use it for "load data when the screen mounts" effects whose
 * callback sets state (setLoading(true), …): React 19's
 * react-hooks/set-state-in-effect rule forbids synchronous setState there.
 *
 * Also skips the call if the component unmounted or the deps changed before the
 * microtask ran (e.g. StrictMode's double-invoked effects).
 */
export function useDeferredEffect(fn, deps) {
  useEffect(() => {
    let alive = true;
    Promise.resolve().then(() => {
      if (alive) fn();
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
