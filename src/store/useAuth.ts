import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Account {
  name: string;
  email: string;
  password: string;
  establishment: string;
  role: string;
}

interface AuthState {
  accounts: Account[];
  currentEmail: string | null;
  register: (account: Account) => {ok: boolean;error?: string;};
  login: (email: string, password: string) => {ok: boolean;error?: string;};
  logout: () => void;
  currentUser: () => Account | null;
}

const demoAccount: Account = {
  name: 'Camille Rousseau',
  email: 'demo@campus-lumiere.fr',
  password: 'demo1234',
  establishment: 'Campus Lumière',
  role: 'Directrice'
};

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      accounts: [demoAccount],
      currentEmail: null,
      register: (account) => {
        const exists = get().accounts.some(
          (a) => a.email.toLowerCase() === account.email.toLowerCase()
        );
        if (exists) return { ok: false, error: 'Un compte existe déjà avec cet e-mail.' };
        set((s) => ({ accounts: [...s.accounts, account], currentEmail: account.email }));
        return { ok: true };
      },
      login: (email, password) => {
        const acc = get().accounts.find(
          (a) => a.email.toLowerCase() === email.toLowerCase()
        );
        if (!acc) return { ok: false, error: 'Aucun compte trouvé avec cet e-mail.' };
        if (acc.password !== password) return { ok: false, error: 'Mot de passe incorrect.' };
        set({ currentEmail: acc.email });
        return { ok: true };
      },
      logout: () => set({ currentEmail: null }),
      currentUser: () => {
        const email = get().currentEmail;
        return get().accounts.find((a) => a.email === email) ?? null;
      }
    }),
    { name: 'smc-auth-v1' }
  )
);