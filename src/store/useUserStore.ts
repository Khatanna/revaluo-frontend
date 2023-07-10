import { create, StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';
import { IUsuario } from '../types';

interface State {
    users: Pick<IUsuario, 'id' | 'nombre'>[]
}

interface Actions {
    setUsers: (users: Pick<IUsuario, 'id' | 'nombre'>[]) => void
}

type AuthState = State & Actions;

const initialState: State = {
    users: [],
}

const middlewares = (f: StateCreator<AuthState>) => (devtools(f))

export const useUserStore = create<State & Actions>()(
    middlewares((set, get) => ({
        ...initialState,
        setUsers: (users: Pick<IUsuario, 'id' | 'nombre'>[]) => {
            set({ ...get(), users })
        }
    })
    )
)
