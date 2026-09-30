import { useState } from "react";
import { motion } from "framer-motion";
import { useIdioma } from "../context/IdiomaContext";

const colores = {
  ivory: "#D6D2C4",
  ivoryClaro: "#EEEAE0",
  burgundy: "#6A2C3E",
  texto: "#392C30",
};

const datosBancarios = {
  banco: "BBVA",
  titular: "Susana Elizabeth Godoy Aguilar",
  clabe: "012320015223253423",
};

export default function MesaRegalos() {
  const { idioma } = useIdioma();
  const t = (es, en) => (idioma === "en" ? en : es);
  const [estadoCopia, setEstadoCopia] = useState("");

  async function copiarClabe() {
    try {
      await navigator.clipboard.writeText(datosBancarios.clabe);
      setEstadoCopia("copiado");
    } catch {
      setEstadoCopia("error");
    }
  }

  return (
    <section
      id="mesa-regalos"
      className="relative overflow-hidden px-5 py-20 sm:px-8 sm:py-28"
      style={{
        backgroundColor: colores.ivory,
        color: colores.texto,
      }}
    >
      <div
        className="pointer-events-none absolute inset-4 border sm:inset-7"
        style={{ borderColor: `${colores.burgundy}55` }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-[21px] border sm:inset-[34px]"
        style={{ borderColor: `${colores.burgundy}24` }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-3xl">
        <motion.header
          className="mb-10 text-center sm:mb-12"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p
            className="text-[10px] uppercase tracking-[0.32em] sm:text-xs"
            style={{ color: colores.burgundy }}
          >
            {t("Con mucho cariño", "With love")}
          </p>

          <h2
            className="mt-4 font-serif text-4xl sm:text-5xl"
            style={{ color: colores.burgundy }}
          >
            {t("Mesa de regalos", "Wedding gifts")}
          </h2>

          <p
            className="mt-4 text-4xl sm:text-5xl"
            style={{
              fontFamily: "'Allura', cursive",
              fontWeight: 400,
              color: colores.burgundy,
            }}
          >
            {t("Tu presencia es nuestro mejor regalo", "Your presence is our greatest gift")}
          </p>

          <div
            className="mx-auto mt-7 h-px w-24"
            style={{ backgroundColor: colores.burgundy }}
          />

          <p className="mx-auto mt-6 max-w-xl font-serif text-sm leading-7 sm:text-base">
            {t(
              "Compartir este día contigo es lo más importante para nosotros. Si deseas hacernos un obsequio, puedes hacerlo mediante una transferencia bancaria.",
              "Sharing this special day with you means the most to us. If you would like to give us a gift, you may do so by bank transfer."
            )}
          </p>
        </motion.header>

        <div
          className="mx-auto max-w-xl rounded-3xl border px-5 py-8 text-center shadow-[0_24px_65px_rgba(76,20,38,0.09)] sm:px-10 sm:py-10"
          style={{
            backgroundColor: colores.ivoryClaro,
            borderColor: `${colores.burgundy}80`,
          }}
        >
          <svg
            className="mx-auto h-10 w-10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: colores.burgundy }}
            aria-hidden="true"
          >
            <path d="m3 9 9-6 9 6H3Z" />
            <path d="M5 9v10M10 9v10M14 9v10M19 9v10M3 19h18M2 22h20" />
          </svg>

          <h3
            className="mt-5 font-serif text-2xl"
            style={{ color: colores.burgundy }}
          >
            {t("Transferencia bancaria", "Bank transfer")}
          </h3>

          <dl className="mt-8 space-y-6">
            <div>
              <dt
                className="text-[10px] uppercase tracking-[0.22em]"
                style={{ color: colores.burgundy }}
              >
                {t("Banco", "Bank")}
              </dt>
              <dd className="mt-2 font-serif text-xl">
                {datosBancarios.banco}
              </dd>
            </div>

            <div>
              <dt
                className="text-[10px] uppercase tracking-[0.22em]"
                style={{ color: colores.burgundy }}
              >
                {t("Titular de la cuenta", "Account holder")}
              </dt>
              <dd className="mt-2 font-serif text-lg leading-7">
                {datosBancarios.titular}
              </dd>
            </div>

            <div>
              <dt
                className="text-[10px] uppercase tracking-[0.22em]"
                style={{ color: colores.burgundy }}
              >
                {t("CLABE interbancaria", "CLABE · Mexican bank account number")}
              </dt>
              <dd
                className="mt-3 select-all break-all font-serif text-lg tracking-wider sm:text-xl"
                style={{ color: colores.burgundy }}
              >
                {datosBancarios.clabe}
              </dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={copiarClabe}
            className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-7 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
            style={{
              backgroundColor: colores.burgundy,
              outlineColor: colores.burgundy,
            }}
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="9" y="9" width="12" height="12" rx="2" />
              <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
            </svg>
            {t("Copiar CLABE", "Copy CLABE")}
          </button>

          <p
            role="status"
            aria-live="polite"
            className="mt-3 min-h-10 text-xs leading-5"
            style={{ color: colores.burgundy }}
          >
            {estadoCopia === "copiado"
              ? t("CLABE copiada correctamente.", "CLABE copied successfully.")
              : estadoCopia === "error"
                ? t(
                    "Selecciona el número de CLABE y cópialo manualmente.",
                    "Select the CLABE number and copy it manually."
                  )
                : ""}
          </p>
        </div>

        <p
          className="mt-8 text-center font-serif text-sm italic"
          style={{ color: colores.burgundy }}
        >
          {t(
            "Gracias por ser parte de nuestra historia.",
            "Thank you for being part of our story."
          )}
        </p>
      </div>
    </section>
  );
}