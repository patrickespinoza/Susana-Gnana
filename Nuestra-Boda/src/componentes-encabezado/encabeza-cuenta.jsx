import { useEffect, useState } from "react";
import { useIdioma } from "../context/IdiomaContext";

function tiempoRestante(targetDate) {
  const diferencia = Math.max(0, new Date(targetDate).getTime() - Date.now());

  return {
    dias: Math.floor(diferencia / 86400000),
    horas: Math.floor((diferencia / 3600000) % 24),
    minutos: Math.floor((diferencia / 60000) % 60),
    segundos: Math.floor((diferencia / 1000) % 60),
    terminado: diferencia === 0,
  };
}

export default function Countdown({ targetDate }) {
  const { idioma } = useIdioma();
  const [tiempo, setTiempo] = useState(() => tiempoRestante(targetDate));

  useEffect(() => {
    setTiempo(tiempoRestante(targetDate));
    const intervalo = window.setInterval(() => {
      setTiempo(tiempoRestante(targetDate));
    }, 1000);
    return () => window.clearInterval(intervalo);
  }, [targetDate]);

  const etiquetas = idioma === "en"
    ? ["Days", "Hours", "Minutes", "Seconds"]
    : ["Días", "Horas", "Minutos", "Segundos"];
  const valores = [tiempo.dias, tiempo.horas, tiempo.minutos, tiempo.segundos];

  return (
    <section className="w-full" aria-label={idioma === "en" ? "Wedding countdown" : "Cuenta regresiva para la boda"}>
      {tiempo.terminado ? (
        <p className="text-center font-serif text-lg sm:text-2xl" style={{ color: "#D6D2C4" }}>
          {idioma === "en" ? "Our special day is here!" : "¡Llegó nuestro gran día!"}
        </p>
      ) : (
        <div className="mx-auto grid w-full max-w-xl grid-cols-4 gap-1.5 sm:gap-3">
          {valores.map((valor, indice) => (
            <div
              key={etiquetas[indice]}
              className="flex min-w-0 flex-col items-center justify-center rounded-xl border px-1 py-3 backdrop-blur-sm sm:py-4"
              style={{ backgroundColor: "rgba(106,44,62,0.82)", borderColor: "rgba(214,210,196,0.6)" }}
            >
              <span className="font-serif text-2xl font-semibold leading-none tabular-nums sm:text-4xl" style={{ color: "#D6D2C4" }}>
                {String(valor).padStart(2, "0")}
              </span>
              <span className="mt-2 max-w-full text-[8px] uppercase tracking-[0.06em] sm:text-[10px] sm:tracking-[0.16em]" style={{ color: "#EEEAE0" }}>
                {etiquetas[indice]}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}