import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useIdioma } from "../context/IdiomaContext";

// Ajusta "position" por foto: "center 30%", "left center", "70% 45%", etc.
const fotos = [
  { src: "/Carrusel01V.JPEG", position: "center center" },
  { src: "/Carrusel02.JPEG", position: "center 60%" },
  { src: "/Carrusel03.JPEG", position: "center center" },
  { src: "/Carrusel04.JPEG", position: "center 70%" },
  { src: "/Carrusel05.JPEG", position: "center center" },
  { src: "/Carrusel06.JPEG", position: "center center" },
  { src: "/Carrusel07.JPEG", position: "center 60%" },
];

const colores = {
  ivory: "#D6D2C4",
  ivoryClaro: "#EEEAE0",
  burgundy: "#6A2C3E",
  burgundyOscuro: "#512131",
  dorado: "#6A2C3E",
  texto: "#392C30",
};

function Flecha({ sentido }) {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path
        d={
          sentido === "anterior"
            ? "m15 18-6-6 6-6"
            : "m9 18 6-6-6-6"
        }
      />
    </svg>
  );
}

export default function Galeria() {
  const { idioma } = useIdioma();
  const t = (es, en) => (idioma === "en" ? en : es);

  const [fotosListas, setFotosListas] = useState([]);
  const [indice, setIndice] = useState(0);

  // Conservamos las referencias mientras la galería esté montada.
  const imagenesPrecargadas = useRef([]);

  useEffect(() => {
    let activo = true;
    imagenesPrecargadas.current = [];

    // Descargamos las imágenes, sin forzar la decodificación
    // simultánea de todas las fotografías.
    Promise.all(
      fotos.map(
        (foto) =>
          new Promise((resolve) => {
            const imagen = new Image();

            imagen.onload = () => resolve(foto);
            imagen.onerror = () => resolve(null);
            imagen.src = foto.src;

            imagenesPrecargadas.current.push(imagen);
          })
      )
    ).then((resultados) => {
      if (activo) {
        setFotosListas(resultados.filter(Boolean));
      }
    });

    return () => {
      activo = false;
      imagenesPrecargadas.current = [];
    };
  }, []);

  useEffect(() => {
    if (fotosListas.length < 2) return undefined;

    const intervalo = window.setInterval(() => {
      setIndice((actual) => (actual + 1) % fotosListas.length);
    }, 4500);

    return () => window.clearInterval(intervalo);
  }, [fotosListas]);

  const cambiar = (nuevoIndice) => {
    if (fotosListas.length < 2 || nuevoIndice === indice) return;
    setIndice(nuevoIndice);
  };

  const anterior = () =>
    cambiar((indice - 1 + fotosListas.length) % fotosListas.length);

  const siguiente = () =>
    cambiar((indice + 1) % fotosListas.length);

  return (
    <section
      id="galeria"
      className="relative overflow-hidden px-5 py-20 sm:px-8 sm:py-28"
      style={{
        backgroundColor: colores.ivory,
        color: colores.texto,
      }}
    >
      <div
        className="pointer-events-none absolute inset-4 border sm:inset-7"
        style={{ borderColor: `${colores.dorado}55` }}
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute inset-[21px] border sm:inset-[34px]"
        style={{ borderColor: `${colores.dorado}24` }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl">
        <motion.header
          className="mx-auto mb-10 max-w-2xl text-center sm:mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p
            className="text-[10px] uppercase tracking-[0.32em] sm:text-xs"
            style={{ color: colores.burgundy }}
          >
            {t("Nuestros momentos", "Our moments")}
          </p>

          <h2
            className="mt-4 font-serif text-4xl sm:text-5xl lg:text-6xl"
            style={{ color: colores.burgundy }}
          >
            {t("Nuestra historia", "Our story")}
          </h2>

          <p
            className="mt-3 text-3xl sm:text-4xl"
            style={{
              fontFamily:
                "'Brittany Signature', 'Cedarville Cursive', cursive",
              color: colores.burgundy,
            }}
          >
            {t("Momentos para siempre", "Moments to cherish")}
          </p>

          <div
            className="mx-auto mt-7 h-px w-24"
            style={{ backgroundColor: colores.dorado }}
          />

          <p className="mx-auto mt-6 max-w-xl font-serif text-sm italic leading-7 sm:text-base">
            {t(
              "Un recorrido por los instantes que nos han traído hasta este día.",
              "A glimpse of the moments that have brought us to this day."
            )}
          </p>
        </motion.header>

        <div
          className="rounded-[1.5rem] border p-2 shadow-[0_24px_65px_rgba(76,20,38,0.09)] sm:p-4"
          style={{
            borderColor: `${colores.dorado}80`,
            backgroundColor: colores.ivoryClaro,
          }}
        >
          <div className="relative h-[390px] overflow-hidden rounded-xl bg-[#D2C8C1] sm:h-[540px] lg:h-[650px]">
            {fotosListas.length > 0 ? (
              <img
                key={fotosListas[indice].src}
                src={fotosListas[indice].src}
                alt={t(
                  `Fotografía ${indice + 1} de ${fotosListas.length} de Susana y Gnana`,
                  `Photo ${indice + 1} of ${fotosListas.length} of Susana and Gnana`
                )}
                draggable="false"
                className="absolute inset-0 h-full w-full object-cover"
                style={{
                  objectPosition: fotosListas[indice].position,
                }}
              />
            ) : (
              <div
                className="flex h-full items-center justify-center px-6 text-center font-serif text-sm"
                style={{ color: colores.burgundy }}
                role="status"
              >
                {t(
                  "Preparando nuestras fotografías…",
                  "Preparing our photos…"
                )}
              </div>
            )}
          </div>

          {/* Navegación fuera de la fotografía */}
          <div className="flex items-center justify-center gap-5 px-4 py-5 sm:gap-8 sm:py-7">
            <motion.button
              type="button"
              onClick={anterior}
              disabled={fotosListas.length < 2}
              aria-label={t(
                "Fotografía anterior",
                "Previous photo"
              )}
              className="flex h-11 w-11 items-center justify-center rounded-full border transition disabled:opacity-40 sm:h-12 sm:w-12"
              style={{
                borderColor: colores.dorado,
                color: colores.burgundy,
              }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
            >
              <Flecha sentido="anterior" />
            </motion.button>

            <p
              className="min-w-16 text-center font-serif text-xl"
              style={{ color: colores.burgundy }}
              aria-live="polite"
            >
              {String(fotosListas.length ? indice + 1 : 0).padStart(
                2,
                "0"
              )}

              <span
                className="mx-2 text-sm"
                style={{ color: colores.dorado }}
              >
                /
              </span>

              {String(fotosListas.length).padStart(2, "0")}
            </p>

            <motion.button
              type="button"
              onClick={siguiente}
              disabled={fotosListas.length < 2}
              aria-label={t(
                "Fotografía siguiente",
                "Next photo"
              )}
              className="flex h-11 w-11 items-center justify-center rounded-full border transition disabled:opacity-40 sm:h-12 sm:w-12"
              style={{
                borderColor: colores.dorado,
                color: colores.burgundy,
              }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
            >
              <Flecha sentido="siguiente" />
            </motion.button>
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-lg text-center font-serif text-sm italic leading-7 sm:text-base">
          {t(
            "Cada fotografía guarda un instante de la historia que hoy celebramos.",
            "Each photograph holds a moment of the story we celebrate today."
          )}
        </p>
      </div>
    </section>
  );
}