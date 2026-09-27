import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const IdiomaContext = createContext(null);

function obtenerIdiomaDelEnlace() {
  return window.location.pathname.endsWith("/en.html") ? "en" : "es";
}

export function IdiomaProvider({ children }) {
  // El idioma del enlace sirve como preferencia inicial.
  // El invitado podrá cambiarlo en la ventana de bienvenida.
  const [idioma, setIdioma] = useState(obtenerIdiomaDelEnlace);

  useEffect(() => {
    document.documentElement.lang = idioma;
  }, [idioma]);

  return (
    <IdiomaContext.Provider value={{ idioma, setIdioma }}>
      {children}
    </IdiomaContext.Provider>
  );
}

export function useIdioma() {
  const contexto = useContext(IdiomaContext);

  if (!contexto) {
    throw new Error("useIdioma debe usarse dentro de IdiomaProvider");
  }

  return contexto;
}