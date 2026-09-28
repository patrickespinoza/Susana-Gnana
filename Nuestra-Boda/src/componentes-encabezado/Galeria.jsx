import { useEffect, useState } from "react";
import { useIdioma } from "../context/IdiomaContext";

const fotos = [
  {
    src: "/Carrusel01v.JPEG",
    position: "center center",
    mobilePosition: "center center",
  },
  {
    src: "/Carrusel02.JPEG",
    position: "center 60%",
    mobilePosition: "center 60%",
  },
  {
    src: "/Carrusel03.JPEG",
    position: "center center",
    mobilePosition: "40% center",
  },
  {
    src: "/Carrusel04.JPEG",
    position: "50% 50%",
    mobilePosition: "20% 90%",
  },
  {
    src: "/Carrusel05.JPEG",
    position: "center center",
    mobilePosition: "75% center",
  },
  {
    src: "/Carrusel06.JPEG",
    position: "center center",
    mobilePosition: "center center",
  },
  {
    src: "/Carrusel07.JPEG",
    position: "center 60%",
    mobilePosition: "90% 60%",
  },
];

const colores = {
  ivory: "#D6D2C4",
  ivoryClaro: "#EEEAE0",
  burgundy: "#6A2C3E",
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

const indiceSiguiente = (indice) => (indice + 1) % fotos.length;
const indiceAnterior = (indice) =>
  (indice - 1 + fotos.length) % fotos.length;

export default function Galeria() {
  const { idioma } = useIdioma();
  const t = (es, en) => (idioma === "en" ? en : es);

  /*
   * Hay dos espacios para imágenes:
   * - active indica cuál está visible.
   * - indexes indica qué fotografía contiene cada espacio.
   * - ready indica si cada fotografía terminó de cargar y decodificar.
   * - pending guarda una solicitud manual mientras carga.
   */
  const [carrusel, setCarrusel] = useState({
    active: 0,
    indexes: [0, 1],
    ready: [false, false],
    pending: null,
  });

  const indiceActual = carrusel.indexes[carrusel.active];
  const primeraLista = carrusel.ready[carrusel.active];

  function cambiarA(destino) {
    setCarrusel((actual) => {
      if (
        !actual.ready[actual.active] ||
        actual.pending !== null ||
        destino === actual.indexes[actual.active]
      ) {
        return actual;
      }

      const espacioOculto = 1 - actual.active;

      // La foto solicitada ya está cargada detrás.
      if (
        actual.indexes[espacioOculto] === destino &&
        actual.ready[espacioOculto]
      ) {
        const indexes = [...actual.indexes];
        const ready = [...actual.ready];

        // El espacio que deja la foto anterior prepara la próxima.
        indexes[actual.active] = indiceSiguiente(destino);
        ready[actual.active] = false;

        return {
          active: espacioOculto,
          indexes,
          ready,
          pending: null,
        };
      }

      // Para una foto no preparada, mantener la actual visible
      // y cargar la solicitada en el espacio oculto.
      const indexes = [...actual.indexes];
      const ready = [...actual.ready];

      indexes[espacioOculto] = destino;
      ready[espacioOculto] = false;

      return {
        ...actual,
        indexes,
        ready,
        pending: destino,
      };
    });
  }

  async function imagenCargada(espacio, fotoIndice, elemento) {
    try {
      // Esperamos también a que el navegador termine de decodificarla.
      await elemento.decode?.();
    } catch {
      // Algunos navegadores pueden rechazar decode aunque onLoad funcione.
    }

    setCarrusel((actual) => {
      // Ignorar un onLoad antiguo si el espacio ya muestra otra foto.
      if (actual.indexes[espacio] !== fotoIndice) {
        return actual;
      }

      const ready = [...actual.ready];
      ready[espacio] = true;

      // Si el invitado pidió esta foto, ahora sí se puede mostrar.
      if (actual.pending === fotoIndice && espacio !== actual.active) {
        const indexes = [...actual.indexes];
        const espacioAnterior = actual.active;

        indexes[espacioAnterior] = indiceSiguiente(fotoIndice);
        ready[espacioAnterior] = false;

        return {
          active: espacio,
          indexes,
          ready,
          pending: null,
        };
      }

      return { ...actual, ready };
    });
  }

  useEffect(() => {
    if (!primeraLista || carrusel.pending !== null || fotos.length < 2) {
      return undefined;
    }

    const temporizador = window.setTimeout(() => {
      cambiarA(indiceSiguiente(indiceActual));
    }, 4500);

    return () => window.clearTimeout(temporizador);
  }, [indiceActual, primeraLista, carrusel.pending]);

  return (
    <section
      id="galeria"
      className="relative overflow-hidden px-5 py-20 sm:px-8 sm:py-28"
      style={{
        backgroundColor: colores.ivory,
        color: colores.texto,
      }}
    >
      <style>{`
        #galeria .foto-galeria {
          object-position: var(--posicion-movil);
        }

        @media (min-width: 640px) {
          #galeria .foto-galeria {
            object-position: var(--posicion-escritorio);
          }
        }
      `}</style>

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
        <header className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
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
        </header>

        <div
          className="rounded-[1.5rem] border p-2 shadow-[0_24px_65px_rgba(76,20,38,0.09)] sm:p-4"
          style={{
            borderColor: `${colores.dorado}80`,
            backgroundColor: colores.ivoryClaro,
          }}
        >
          <div className="relative h-[390px] overflow-hidden rounded-xl bg-[#D2C8C1] sm:h-[540px] lg:h-[650px]">
            {[0, 1].map((espacio) => {
              const fotoIndice = carrusel.indexes[espacio];
              const foto = fotos[fotoIndice];

              return (
                <img
                  key={espacio}
                  src={foto.src}
                  alt={
                    espacio === carrusel.active
                      ? t(
                          `Fotografía ${fotoIndice + 1} de ${fotos.length} de Susana y Gnana`,
                          `Photo ${fotoIndice + 1} of ${fotos.length} of Susana and Gnana`
                        )
                      : ""
                  }
                  aria-hidden={espacio !== carrusel.active}
                  draggable="false"
                  decoding="async"
                  onLoad={(evento) =>
                    imagenCargada(
                      espacio,
                      fotoIndice,
                      evento.currentTarget
                    )
                  }
                  className="foto-galeria absolute inset-0 h-full w-full object-cover"
                  style={{
                    "--posicion-movil": foto.mobilePosition,
                    "--posicion-escritorio": foto.position,
                    opacity: espacio === carrusel.active ? 1 : 0,
                    zIndex: espacio === carrusel.active ? 2 : 1,
                    pointerEvents: "none",
                  }}
                />
              );
            })}
          </div>

          {/* Botones fuera de la fotografía */}
          <div className="flex items-center justify-center gap-5 px-4 py-5 sm:gap-8 sm:py-7">
            <button
              type="button"
              onClick={() => cambiarA(indiceAnterior(indiceActual))}
              disabled={!primeraLista || carrusel.pending !== null}
              aria-label={t(
                "Fotografía anterior",
                "Previous photo"
              )}
              className="flex h-11 w-11 items-center justify-center rounded-full border transition-colors disabled:opacity-40 sm:h-12 sm:w-12"
              style={{
                borderColor: colores.dorado,
                color: colores.burgundy,
              }}
            >
              <Flecha sentido="anterior" />
            </button>

            <p
              className="min-w-16 text-center font-serif text-xl"
              style={{ color: colores.burgundy }}
              aria-live="polite"
            >
              {String(indiceActual + 1).padStart(2, "0")}

              <span
                className="mx-2 text-sm"
                style={{ color: colores.dorado }}
              >
                /
              </span>

              {String(fotos.length).padStart(2, "0")}
            </p>

            <button
              type="button"
              onClick={() => cambiarA(indiceSiguiente(indiceActual))}
              disabled={!primeraLista || carrusel.pending !== null}
              aria-label={t(
                "Fotografía siguiente",
                "Next photo"
              )}
              className="flex h-11 w-11 items-center justify-center rounded-full border transition-colors disabled:opacity-40 sm:h-12 sm:w-12"
              style={{
                borderColor: colores.dorado,
                color: colores.burgundy,
              }}
            >
              <Flecha sentido="siguiente" />
            </button>
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