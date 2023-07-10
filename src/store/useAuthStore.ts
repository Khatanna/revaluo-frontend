import { create, StateCreator } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { IUsuario } from '../types';


interface State {
    token: string,
    user?: IUsuario,
    isAuth: boolean
}

interface Actions {
    login: (user: IUsuario, token: string) => void
    logout: () => void
}

type AuthState = State & Actions;

const initialState: State = {
    token: "",
    user: undefined,
    isAuth: false,
}

const middlewares = (f: StateCreator<AuthState>) => (persist(devtools(f), { name: 'auth', storage: createJSONStorage(() => sessionStorage) }))

export const useAuthStore = create<State & Actions>()(
    middlewares((set, get) => ({
        ...initialState,
        login: (user: IUsuario, token: string) => {
            set({ ...get(), token, user, isAuth: true })
        },
        logout: () => {
            set(initialState)
        }
    })
    )
)
