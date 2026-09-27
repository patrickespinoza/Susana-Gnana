import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const IdiomaContext = createContext(null);

function idiomaDelEnlace() {
  return window.location.pathname === "/en.html"
    ? "en"
    : "es";
}

export function IdiomaProvider({ children }) {
  const [idioma, setIdioma] = useState(idiomaDelEnlace);

  useEffect(() => {
    document.documentElement.lang = idioma;
  }, [idioma]);

  return (
    <IdiomaContext.Provider
      value={{ idioma, setIdioma }}
    >
      {children}
    </IdiomaContext.Provider>
  );
}

export function useIdioma() {
  const contexto = useContext(IdiomaContext);

  if (!contexto) {
    throw new Error(
      "useIdioma debe usarse dentro de IdiomaProvider"
    );
  }

  return contexto;
}