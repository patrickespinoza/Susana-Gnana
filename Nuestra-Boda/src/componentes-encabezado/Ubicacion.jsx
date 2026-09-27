import { motion } from "framer-motion";
import { useIdioma } from "../context/IdiomaContext";

// Si este archivo vive en otra carpeta, ajusta solamente esta ruta de importación.
const colores = {
  ivory: "#D6D2C4",
  ivoryClaro: "#EEEAE0",
  burgundy: "#6A2C3E",
  burgundyOscuro: "#512131",
  dorado: "#6A2C3E",
  texto: "#392C30",
};

const aparecer = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
};

function Separador() {
  return (
    <div className="flex items-center justify-center gap-3" aria-hidden="true">
      <span className="h-px w-12" style={{ backgroundColor: colores.dorado }} />
      <span className="h-1.5 w-1.5 rotate-45 border" style={{ borderColor: colores.dorado }} />
      <span className="h-px w-12" style={{ backgroundColor: colores.dorado }} />
    </div>
  );
}

function PinIcono() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export default function EventoDireccion() {
  const { idioma } = useIdioma();
  const texto = (es, en) => (idioma === "en" ? en : es);

  return (
    <section
      id="ubicacion"
      className="relative isolate overflow-hidden px-5 py-20 sm:px-8 sm:py-28 lg:py-32"
      style={{ backgroundColor: colores.ivory, color: colores.texto }}
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

      <motion.div
        className="relative mx-auto max-w-6xl"
        variants={aparecer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.12 }}
      >
        <header className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          <p
            className="text-[10px] uppercase tracking-[0.32em] sm:text-xs"
            style={{ color: colores.burgundy }}
          >
            {texto("Nuestra celebración", "Our celebration")}
          </p>

          <h2
            className="mt-4 font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl"
            style={{ color: colores.burgundy }}
          >
            {texto("Un día para recordar", "A day to remember")}
          </h2>

          <p
            className="mt-2 text-3xl sm:text-4xl"
            style={{ fontFamily: "'Brittany Signature', 'Cedarville Cursive', cursive", color: colores.burgundy }}
          >
            Susana & Gnana
          </p>

          <div className="mt-7"><Separador /></div>
          <p className="mx-auto mt-6 max-w-xl font-serif text-sm leading-7 sm:text-base">
            {texto(
              "Nos hará muy felices compartir contigo este momento tan especial.",
              "We would be delighted to share this special moment with you."
            )}
          </p>
        </header>

        <div
          className="grid overflow-hidden rounded-[1.5rem] border shadow-[0_24px_65px_rgba(76,20,38,0.09)] md:grid-cols-[0.9fr_1.1fr]"
          style={{ backgroundColor: colores.ivoryClaro, borderColor: `${colores.dorado}80` }}
        >
          <div
            className="flex flex-col items-center justify-center border-b px-6 py-12 text-center sm:py-16 md:border-b-0 md:border-r"
            style={{ borderColor: `${colores.dorado}80`, backgroundColor: "#E2DDD2" }}
          >
            <p className="text-xs uppercase tracking-[0.28em]" style={{ color: colores.burgundy }}>
              {texto("Reserva la fecha", "Save the date")}
            </p>
            <p className="mt-8 font-serif text-base uppercase tracking-[0.2em]" style={{ color: colores.texto }}>
              {texto("Domingo", "Sunday")}
            </p>
            <p className="font-serif text-[104px] leading-none sm:text-[128px]" style={{ color: colores.burgundy }}>
              14
            </p>
            <p className="mt-2 font-serif text-sm uppercase tracking-[0.26em]" style={{ color: colores.burgundy }}>
              {texto("Febrero · 2027", "February · 2027")}
            </p>
            <div className="mt-8"><Separador /></div>
          </div>

          <div className="flex flex-col items-center justify-center px-6 py-12 text-center sm:px-12 sm:py-16">
            <p className="text-xs uppercase tracking-[0.28em]" style={{ color: colores.burgundy }}>
              {texto("Lugar del evento", "Event venue")}
            </p>
            <h3 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl" style={{ color: colores.burgundy }}>
              Casa Borell
            </h3>
            <div className="my-7"><Separador /></div>
            <p className="text-[10px] uppercase tracking-[0.28em]" style={{ color: colores.texto }}>
              {texto("Hora de inicio", "Starts at")}
            </p>
            <p className="mt-2 font-serif text-4xl sm:text-5xl" style={{ color: colores.burgundy }}>
              {texto("5:00 p. m.", "5:00 PM")}
            </p>
            <p className="mt-8 max-w-xs font-serif text-sm leading-6 sm:text-base">
              {texto(
                "Consulta la ubicación y acompáñanos a celebrar.",
                "View the location and join us for the celebration."
              )}
            </p>
            <motion.a
              href="https://maps.app.goo.gl/8VkRoqGbjhdSjTqz6"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={texto("Abrir Casa Borell en Google Maps", "Open Casa Borell in Google Maps")}
              className="mt-8 inline-flex min-h-12 items-center justify-center gap-3 rounded-full px-8 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
              style={{ backgroundColor: colores.burgundy, outlineColor: colores.burgundy }}
              whileHover={{ y: -2, backgroundColor: colores.burgundyOscuro }}
              whileTap={{ scale: 0.98 }}
            >
              <PinIcono />
              {texto("Cómo llegar", "Get directions")}
            </motion.a>
          </div>
        </div>

        <p className="mx-auto mt-10 max-w-xl text-center font-serif text-sm italic leading-7 sm:text-base">
          {texto(
            "Esperamos contar con tu presencia en este día que guardaremos para siempre.",
            "We hope you can join us for a day we will cherish forever."
          )}
        </p>
      </motion.div>
    </section>
  );
}