import { create } from "zustand";

type UIKeyState = {
  uiKeyMap: Map<string, string>;
  getUIKey: (id: string) => string;
  setUIKey: (id: string, key: string) => void;
  transferUIKey: (fromId: string, toId: string) => void;
  deleteUIKey: (id: string) => void;
  cleanupUIKeys: (validIds: string[]) => void;
  reset: () => void;
};

export const useUIKeyStore = create<UIKeyState>((set, get) => ({
  uiKeyMap: new Map(),

  getUIKey: (id) => {
    const map = get().uiKeyMap;

    let key = map.get(id);

    if (!key) {
      key = crypto.randomUUID();

      const newMap = new Map(map);

      newMap.set(id, key);

      set({ uiKeyMap: newMap });
    }

    return key;
  },

  setUIKey: (id, key) => {
    const map = get().uiKeyMap;

    const newMap = new Map(map);

    newMap.set(id, key);

    set({ uiKeyMap: newMap });
  },

  transferUIKey: (fromId, toId) => {
    const map = get().uiKeyMap;

    const key = map.get(fromId);

    if (!key) return;

    const newMap = new Map(map);

    newMap.delete(fromId);
    newMap.set(toId, key);

    set({ uiKeyMap: newMap });
  },

  deleteUIKey: (id) => {
    const map = get().uiKeyMap;

    if (!map.has(id)) return;

    const newMap = new Map(map);

    newMap.delete(id);

    set({ uiKeyMap: newMap });
  },

  cleanupUIKeys: (validIds: string[]) => {
    const map = get().uiKeyMap;

    const validSet = new Set(validIds);

    let changed = false;

    const newEntries: [string, string][] = [];

    for (const [id, key] of map) {
      if (validSet.has(id)) {
        newEntries.push([id, key]);
      } else {
        changed = true;
      }
    }

    if (!changed) return;

    set({ uiKeyMap: new Map(newEntries) });
  },

  reset: () =>
    set({
      uiKeyMap: new Map<string, string>(),
    }),
}));
