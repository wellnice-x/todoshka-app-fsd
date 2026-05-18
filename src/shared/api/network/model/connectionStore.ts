import { create } from "zustand";
import { useShallow } from "zustand/shallow";

export type ConnectionStatus = "online" | "offline" | "checking";

type ConnectionStore = {
  connectionStatus: ConnectionStatus;
  hasConnectionJustLost: boolean;
  hasConnectionJustRecovered: boolean;
  setConnectionStatus: (status: ConnectionStatus) => void;
  markConnectionLost: () => void;
  markConnectionRecovered: () => void;
  resetFlags: () => void;
  reset: () => void;
};

export const useConnectionStore = create<ConnectionStore>((set) => ({
  connectionStatus: "checking",
  hasConnectionJustLost: false,
  hasConnectionJustRecovered: false,

  setConnectionStatus: (status) => set({ connectionStatus: status }),

  markConnectionLost: () =>
    set({
      hasConnectionJustLost: true,
      hasConnectionJustRecovered: false,
    }),

  markConnectionRecovered: () =>
    set({
      hasConnectionJustRecovered: true,
      hasConnectionJustLost: false,
    }),

  resetFlags: () =>
    set({
      hasConnectionJustLost: false,
      hasConnectionJustRecovered: false,
    }),

  reset: () =>
    set({
      connectionStatus: "checking",
      hasConnectionJustLost: false,
      hasConnectionJustRecovered: false,
    }),
}));

const connectionSelectors = {
  connection: (state: ConnectionStore) => ({
    connectionStatus: state.connectionStatus,
    hasConnectionJustLost: state.hasConnectionJustLost,
    hasConnectionJustRecovered: state.hasConnectionJustRecovered,
    setConnectionStatus: state.setConnectionStatus,
    markConnectionLost: state.markConnectionLost,
    markConnectionRecovered: state.markConnectionRecovered,
    resetFlags: state.resetFlags,
    reset: state.reset,
  }),
};

export const useConnection = () =>
  useConnectionStore(useShallow(connectionSelectors.connection));
