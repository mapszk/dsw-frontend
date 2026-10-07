// Guarda el token de la API en localStorage y avisa a los suscriptores cuando cambia
// (login, logout o sesion vencida), para que la UI reaccione.
const KEY = 'dsw-token';

type Listener = () => void;
const listeners = new Set<Listener>();

function notificar() {
  listeners.forEach((listener) => listener());
}

export const tokenStorage = {
  get(): string | null {
    try {
      return localStorage.getItem(KEY);
    } catch {
      return null;
    }
  },
  set(token: string) {
    try {
      localStorage.setItem(KEY, token);
    } finally {
      notificar();
    }
  },
  clear() {
    try {
      localStorage.removeItem(KEY);
    } finally {
      notificar();
    }
  },
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
