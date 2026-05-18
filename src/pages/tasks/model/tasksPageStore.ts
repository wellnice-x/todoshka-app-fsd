import { create } from "zustand";

type TasksPageStore = {
  scrollY: number | null;
  highlightedTaskId: string | null;
  setScrollY: (y: number) => void;
  setHighlightedTaskId: (id: string) => void;
  consumeScrollY: () => number | null;
  consumeHighlight: () => string | null;
  reset: () => void;
};

export const useTasksPageStore = create<TasksPageStore>((set, get) => ({
  scrollY: null,
  highlightedTaskId: null,

  setScrollY: (y) => set({ scrollY: y }),

  setHighlightedTaskId: (id) => set({ highlightedTaskId: id }),

  consumeScrollY: () => {
    const value = get().scrollY;

    set({ scrollY: null });

    return value;
  },

  consumeHighlight: () => {
    const value = get().highlightedTaskId;

    set({ highlightedTaskId: null });

    return value;
  },

  reset: () => set({ scrollY: null, highlightedTaskId: null }),
}));
