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
    mobilePosition: "60% center",
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

function siguiente(indice) {
  return (indice + 1) % fotos.length;
}

function anterior(indice) {
  return (indice - 1 + fotos.length) % fotos.length;
}

function activarFoto(estado, espacioNuevo, fotoNueva) {
  const espacioAnterior = estado.active;
  const indexes = [...estado.indexes];
  const ready = [...estado.ready];

  const fotoParaPreparar = siguiente(fotoNueva);

  /*
   * Si el espacio anterior ya contiene esa misma fotografía,
   * conserva ready=true. Su src no cambia y onLoad no volverá
   * a ejecutarse.
   */
  if (indexes[espacioAnterior] !== fotoParaPreparar) {
    indexes[espacioAnterior] = fotoParaPreparar;
    ready[espacioAnterior] = false;
  }

  return {
    active: espacioNuevo,
    indexes,
    ready,
    pending: null,
  };
}

export default function Galeria() {
  const { idioma } = useIdioma();
  const t = (es, en) => (idioma === "en" ? en : es);

  const [carrusel, setCarrusel] = useState({
    active: 0,
    indexes: [0, 1],
    ready: [false, false],
    pending: null,
  });

  const indiceActual = carrusel.indexes[carrusel.active];
  const fotoVisibleLista = carrusel.ready[carrusel.active];

  function cambiarA(destino) {
    setCarrusel((estado) => {
      if (
        !estado.ready[estado.active] ||
        destino === estado.indexes[estado.active]
      ) {
        return estado;
      }

      const espacioOculto = 1 - estado.active;

      // La fotografía solicitada ya está cargada detrás.
      if (
        estado.indexes[espacioOculto] === destino &&
        estado.ready[espacioOculto]
      ) {
        return activarFoto(estado, espacioOculto, destino);
      }

      // Ya solicitamos esa misma fotografía y sigue cargando.
      if (
        estado.indexes[espacioOculto] === destino &&
        estado.pending === destino
      ) {
        return estado;
      }

      // Mantener visible la actual mientras carga la solicitada.
      const indexes = [...estado.indexes];
      const ready = [...estado.ready];

      if (indexes[espacioOculto] !== destino) {
        indexes[espacioOculto] = destino;
        ready[espacioOculto] = false;
      }

      return {
        ...estado,
        indexes,
        ready,
        pending: destino,
      };
    });
  }

  function imagenCargada(espacio, fotoIndice) {
    setCarrusel((estado) => {
      if (estado.indexes[espacio] !== fotoIndice) {
        return estado;
      }

      const ready = [...estado.ready];
      ready[espacio] = true;

      if (
        estado.pending === fotoIndice &&
        espacio !== estado.active
      ) {
        return activarFoto(
          { ...estado, ready },
          espacio,
          fotoIndice
        );
      }

      return { ...estado, ready };
    });
  }

  function imagenFallida(espacio, fotoIndice) {
    setCarrusel((estado) => {
      if (estado.indexes[espacio] !== fotoIndice) {
        return estado;
      }

      if (estado.pending === fotoIndice) {
        return { ...estado, pending: null };
      }

      return estado;
    });
  }

  useEffect(() => {
    if (
      !fotoVisibleLista ||
      carrusel.pending !== null ||
      fotos.length < 2
    ) {
      return undefined;
    }

    const temporizador = window.setTimeout(() => {
      cambiarA(siguiente(indiceActual));
    }, 4500);

    return () => window.clearTimeout(temporizador);
  }, [indiceActual, fotoVisibleLista, carrusel.pending]);

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
              const visible = espacio === carrusel.active;

              return (
                <img
                  key={`${espacio}-${fotoIndice}`}
                  src={foto.src}
                  alt={
                    visible
                      ? t(
                          `Fotografía ${fotoIndice + 1} de ${fotos.length} de Susana y Gnana`,
                          `Photo ${fotoIndice + 1} of ${fotos.length} of Susana and Gnana`
                        )
                      : ""
                  }
                  aria-hidden={!visible}
                  draggable="false"
                  decoding="async"
                  onLoad={() =>
                    imagenCargada(espacio, fotoIndice)
                  }
                  onError={() =>
                    imagenFallida(espacio, fotoIndice)
                  }
                  className="foto-galeria absolute inset-0 h-full w-full object-cover"
                  style={{
                    "--posicion-movil": foto.mobilePosition,
                    "--posicion-escritorio": foto.position,
                    opacity: visible ? 1 : 0,
                    zIndex: visible ? 2 : 1,
                    pointerEvents: "none",
                  }}
                />
              );
            })}
          </div>

          {/* Navegación fuera de la fotografía */}
          <div className="flex items-center justify-center gap-5 px-4 py-5 sm:gap-8 sm:py-7">
            <button
              type="button"
              onClick={() => cambiarA(anterior(indiceActual))}
              disabled={!fotoVisibleLista}
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
              onClick={() => cambiarA(siguiente(indiceActual))}
              disabled={!fotoVisibleLista}
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