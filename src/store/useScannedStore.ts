import { create, StateCreator } from "zustand";
import { persist } from "zustand/middleware";
import { IScanned } from "../types";

interface State {
  scanned: IScanned[];
  group: string;
}

interface Actions {
  addScanned: (activo: IScanned) => void;
  checkScanned: (index: number) => void;
  deleteScanned: (codigo: string) => void;
  exist: (codigo: string) => boolean;
  resetState: () => void;
}

type ScannedState = State & Actions;

const initialState: State = {
  scanned: [],
  group: "",
};

const middlewares = (f: StateCreator<ScannedState>) =>
  persist(f, { name: "scanned" });

export const useScannedStore = create<State & Actions>()(
  middlewares((set, get) => ({
    ...initialState,
    addScanned: (activo) => {
      set({
        scanned: [activo, ...get().scanned],
      });
    },
    checkScanned: (index) => {
      set({
        scanned: get().scanned.map((scanned, i) => {
          if (index === i) {
            scanned.print = !scanned.print;
          }

          return scanned;
        }),
      });
    },
    deleteScanned: (codigo) => {
      set({
        ...get(),
        scanned: get().scanned.filter((scan) => scan.codigo !== codigo),
      });
    },
    exist: (codigo) => {
      return get().scanned.some((scanned) => scanned.codigo === codigo);
    },
    resetState: () => {
      set(initialState);
    },
  })),
);
