// Avisa que la API rechazo la sesion (cookie vencida o invalida) para que la UI vuelva al login.
// La cookie es httpOnly: el frontend no puede leerla, solo se entera por las respuestas 401.
type Listener = () => void;

const listeners = new Set<Listener>();

export const sessionEvents = {
  expirada() {
    listeners.forEach((listener) => listener());
  },
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
