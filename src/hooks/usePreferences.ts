import { useState, useEffect } from 'react';
import type { SortKey } from '@/types/sort';
import type { Theme } from '@/types/theme';

export type Preferences = {
  defaultSort: SortKey;
  theme: Theme;
};

const STORAGE_KEY = 'riftbound_preferences';

const DEFAULTS: Preferences = {
  defaultSort: 'price-desc',
  theme: 'system',
};

function loadCache(): Preferences {
  try {
    return {
      ...DEFAULTS,
      ...JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}'),
    };
  } catch {
    return DEFAULTS;
  }
}

function saveCache(preferences: Preferences) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
}

function systemPrefersDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyTheme(theme: Theme) {
  const dark = theme === 'dark' || (theme === 'system' && systemPrefersDark());
  document.documentElement.classList.toggle('dark', dark);
}

// Module-level store so all usePreferences() calls share the same state
let store: Preferences = (() => {
  const cached = loadCache();
  applyTheme(cached.theme);
  return cached;
})();
let fetchedForUser: string | null = null;

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((fn) => fn());
}

function setStore(preferences: Preferences) {
  store = preferences;
  applyTheme(preferences.theme);
  saveCache(preferences);
  notify();
}

export function usePreferences(userId?: string) {
  const [, rerender] = useState(0);

  useEffect(() => {
    const fn = () => rerender((n) => n + 1);
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  }, []);

  // Fetch from server once per authenticated user, regardless of how many components call this hook
  useEffect(() => {
    if (!userId || fetchedForUser === userId) return;
    fetchedForUser = userId;
    fetch('/api/preferences', { credentials: 'include' })
      .then((r) => r.json())
      .then((data: Preferences) => setStore({ ...DEFAULTS, ...data }))
      .catch(() => {
        /* keep cached value on network error */
      });
  }, [userId]);

  function update(patch: Partial<Preferences>) {
    const next = { ...store, ...patch };
    setStore(next);
    fetch('/api/preferences', {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    }).catch(() => {
      /* optimistic update already applied */
    });
  }

  return { preferences: store, update };
}
