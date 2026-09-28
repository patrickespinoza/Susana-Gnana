import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useIdioma } from "../context/IdiomaContext";

const colores = {
  ivory: "#D6D2C4",
  ivoryClaro: "#EEEAE0",
  burgundy: "#6A2C3E",
  dorado: "#6A2C3E",
  texto: "#392C30",
};

// Coloca las imágenes finales en public con estos nombres o cambia las rutas.
// Si el texto está dentro de la imagen, necesitaremos una versión por idioma.
const imagenes = {
  es: "/vestimenta-es.jpeg",
  en: "/vestimenta-en.jpeg",
};

export default function DressCodePremium() {
  const { idioma } = useIdioma();
  const t = (es, en) => idioma === "en" ? en : es;
  const [falloImagen, setFalloImagen] = useState(false);
  const ruta = imagenes[idioma] || imagenes.es;

  useEffect(() => {
    setFalloImagen(false);
  }, [ruta]);

  return (
    <section
      id="vestimenta"
      className="relative overflow-hidden px-5 py-20 sm:px-8 sm:py-28"
      style={{ backgroundColor: colores.ivory, color: colores.texto }}
    >
      <div className="pointer-events-none absolute inset-4 border sm:inset-7" style={{ borderColor: `${colores.dorado}55` }} aria-hidden="true" />
      <div className="pointer-events-none absolute inset-[21px] border sm:inset-[34px]" style={{ borderColor: `${colores.dorado}24` }} aria-hidden="true" />

      <motion.div
        className="relative mx-auto max-w-4xl text-center"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-[10px] uppercase tracking-[0.32em] sm:text-xs" style={{ color: colores.burgundy }}>
          {t("Detalles de la celebración", "Celebration details")}
        </p>
        <h2 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-6xl" style={{ color: colores.burgundy }}>
          {t("Código de vestimenta", "Dress code")}
        </h2>
        <p
          className="mt-2 text-3xl sm:text-4xl"
          style={{ fontFamily: "'Brittany Signature', 'Cedarville Cursive', cursive", color: colores.burgundy }}
        >
          {t("Para este día especial", "For our special day")}
        </p>
        <div className="mx-auto mb-9 mt-7 h-px w-24" style={{ backgroundColor: colores.dorado }} />

        <div
          className="mx-auto max-w-3xl rounded-[1.5rem] border p-3 shadow-[0_24px_65px_rgba(76,20,38,0.09)] sm:p-5"
          style={{ borderColor: `${colores.dorado}80`, backgroundColor: colores.ivoryClaro }}
        >
          {!falloImagen ? (
            <img
              key={ruta}
              src={ruta}
              alt={t("Indicaciones de vestimenta para la boda de Susana y Gnana", "Dress code details for Susana and Gnana's wedding")}
              className="block h-auto w-full rounded-xl object-contain"
              loading="lazy"
              onLoad={() => setFalloImagen(false)}
              onError={() => setFalloImagen(true)}
            />
          ) : (
            <div className="flex min-h-64 items-center justify-center rounded-xl px-6 py-12" style={{ backgroundColor: "#E2DDD2" }}>
              <p className="font-serif text-base italic" style={{ color: colores.burgundy }}>
                {t("Próximamente compartiremos los detalles de vestimenta.", "Dress code details are coming soon.")}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}