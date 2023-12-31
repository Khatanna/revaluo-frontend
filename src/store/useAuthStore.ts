import { create, StateCreator } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { IUsuario } from "../types";

interface State {
  token: string;
  user?: IUsuario;
  isAuth: boolean;
  piso?: string;
}

interface Actions {
  login: (user: IUsuario, token: string) => void;
  logout: () => void;
  update: (user: Pick<IUsuario, "nombre" | "color">, piso?: string) => void;
}

type AuthState = State & Actions;

const initialState: State = {
  token: "",
  user: undefined,
  isAuth: false,
  piso: undefined,
};

const middlewares = (f: StateCreator<AuthState>) =>
  persist(devtools(f), {
    name: "auth",
    storage: createJSONStorage(() => sessionStorage),
  });

export const useAuthStore = create<State & Actions>()(
  middlewares((set, get) => ({
    ...initialState,
    login: (user: IUsuario, token: string) => {
      set({ token, user: { ...user }, isAuth: true });
    },
    logout: () => {
      set(initialState);
    },
    update: (user: Pick<IUsuario, "nombre" | "color">, piso?: string) => {
      set({ ...get(), ...user, piso });
    },
  })),
);
