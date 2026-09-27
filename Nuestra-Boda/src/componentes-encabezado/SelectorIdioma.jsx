import { useState } from "react";
import { useIdioma } from "../context/IdiomaContext";

export default function SelectorIdioma({ onContinuar }) {
  const { idioma, setIdioma } = useIdioma();
  const [visible, setVisible] = useState(true);

  function elegir(nuevoIdioma) {
    setIdioma(nuevoIdioma);
    setVisible(false);
    onContinuar?.(nuevoIdioma);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center px-5 py-8" style={{ backgroundColor: "#D6D2C4" }} role="dialog" aria-modal="true" aria-labelledby="titulo-idioma">
      <div className="w-full max-w-md rounded-[2rem] border px-7 py-10 text-center shadow-2xl sm:px-10" style={{ backgroundColor: "#EEEAE0", borderColor: "#6A2C3E" }}>
        <p className="mb-3 text-xs uppercase tracking-[0.3em]" style={{ color: "#6A2C3E" }}>Susana & Gnana</p>
        <h2 id="titulo-idioma" className="font-serif text-3xl sm:text-4xl" style={{ color: "#6A2C3E" }}>
          {idioma === "en" ? "Welcome" : "Bienvenidos"}
        </h2>
        <p className="mx-auto mt-4 max-w-xs font-serif text-sm leading-6 sm:text-base" style={{ color: "#392C30" }}>
          {idioma === "en" ? "Choose your preferred language to open our invitation." : "Elige el idioma de tu preferencia para abrir nuestra invitación."}
        </p>
        <div className="mt-8 grid gap-3">
          <button type="button" onClick={() => elegir("es")} className="flex min-h-14 items-center justify-center gap-3 rounded-full border px-5 font-serif transition hover:opacity-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" style={{ borderColor: "#6A2C3E", color: "#6A2C3E", backgroundColor: "#D6D2C4", outlineColor: "#6A2C3E" }}>
            <span aria-hidden="true" className="text-xl">🇲🇽</span><span>Español</span>
          </button>
          <button type="button" onClick={() => elegir("en")} className="flex min-h-14 items-center justify-center gap-3 rounded-full border px-5 font-serif transition hover:opacity-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" style={{ borderColor: "#6A2C3E", color: "#6A2C3E", backgroundColor: "#D6D2C4", outlineColor: "#6A2C3E" }}>
            <span aria-hidden="true" className="text-xl">🇺🇸</span><span>English</span>
          </button>
        </div>
      </div>
    </div>
  );
}
