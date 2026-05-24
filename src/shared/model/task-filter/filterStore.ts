import { create } from "zustand";
import { useShallow } from "zustand/shallow";

export type FilterState = "all" | "active" | "completed";

type FilterStore = {
  searchQuery: string;
  activeFilter: FilterState;
  setSearchQuery: (value: string) => void;
  setActiveFilter: (value: FilterState) => void;
  reset: () => void;
};

export const useFilterStore = create<FilterStore>()((set) => ({
  searchQuery: "",
  activeFilter: "all",

  setSearchQuery: (value) => set({ searchQuery: value }),

  setActiveFilter: (value) => set({ activeFilter: value }),

  reset: () =>
    set({
      searchQuery: "",
      activeFilter: "all",
    }),
}));

const filterSelectors = {
  filter: (state: FilterStore) => ({
    searchQuery: state.searchQuery,
    activeFilter: state.activeFilter,
    setSearchQuery: state.setSearchQuery,
    setActiveFilter: state.setActiveFilter,
    reset: state.reset,
  }),
};

export const useFilter = () =>
  useFilterStore(useShallow(filterSelectors.filter));
