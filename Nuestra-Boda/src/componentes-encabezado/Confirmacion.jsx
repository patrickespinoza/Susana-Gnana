import { useEffect, useMemo, useState } from "react";
import { useIdioma } from "../context/IdiomaContext";
import { enviarAccion } from "../bridgeSusana";
import Menu from "./Menu";
import { QRCodeSVG } from "qrcode.react";

const colores = {
  ivory: "#D6D2C4",
  claro: "#EEEAE0",
  burgundy: "#6A2C3E",
  texto: "#392C30",
};

function leerInvitacion() {
  const id = new URLSearchParams(window.location.search).get("id");

  if (!id) return null;

  try {
    const normalizado = id.replace(/-/g, "+").replace(/_/g, "/");
    const binario = atob(
      normalizado.padEnd(Math.ceil(normalizado.length / 4) * 4, "=")
    );

    const texto = new TextDecoder().decode(
      Uint8Array.from(binario, caracter => caracter.charCodeAt(0))
    );

    const datos = JSON.parse([...texto].reverse().join(""));

    if (typeof datos.clave !== "string") return null;

    return datos;
  } catch {
    return null;
  }
}

export default function Confirmacion() {
  const { idioma } = useIdioma();
  const traducir = (es, en) => (idioma === "en" ? en : es);

  const invitacion = useMemo(leerInvitacion, []);

  const [registro, setRegistro] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [asistencia, setAsistencia] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [paso, setPaso] = useState("confirmacion");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;

    if (!invitacion) {
      setError("Enlace de invitación inválido o incompleto.");
      setCargando(false);
      return;
    }

    enviarAccion("consultar", { clave: invitacion.clave })
      .then(respuesta => {
        if (!activo) return;

        if (!respuesta?.ok) {
          throw new Error(
            respuesta?.error || "Invitación no registrada."
          );
        }

        setRegistro(respuesta);
        setCantidad(1);
      })
      .catch(err => {
        if (activo) setError(err.message);
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, [invitacion]);

  async function terminar(confirmados, personas) {
    if (enviando || !invitacion) return;

    setEnviando(true);
    setError("");

    try {
      const respuesta = await enviarAccion("confirmar", {
        clave: invitacion.clave,
        confirmados,
        personas,
      });

      if (!respuesta?.ok) {
        throw new Error(
          respuesta?.error || "No se pudo guardar la confirmación."
        );
      }

      const actual = await enviarAccion("consultar", {
        clave: invitacion.clave,
      });

      if (!actual?.ok) {
        throw new Error(
          actual?.error || "No se pudo consultar la respuesta."
        );
      }

      setRegistro(actual);
      setPaso("resultado");
    } catch (err) {
      setError(err.message);

      // Si el envío se guardó pero falló la respuesta de red,
      // consultamos el estado antes de permitir otro intento.
      try {
        const actual = await enviarAccion("consultar", {
          clave: invitacion.clave,
        });

        if (actual?.ok && actual.estado !== "pendiente") {
          setRegistro(actual);
          setPaso("resultado");
          setError("");
        }
      } catch {
        // Conservamos el mensaje original.
      }
    } finally {
      setEnviando(false);
    }
  }

  if (cargando) {
    return (
      <p
        className="py-20 text-center font-serif"
        style={{ backgroundColor: colores.ivory }}
      >
        {traducir("Consultando invitación…", "Checking invitation…")}
      </p>
    );
  }

  if (error && !registro) {
    return (
      <section
        className="px-5 py-20 text-center font-serif"
        style={{
          backgroundColor: colores.ivory,
          color: colores.burgundy,
        }}
      >
        {error}
      </section>
    );
  }

  if (!registro) return null;

  if (paso === "menu" && registro.estado === "pendiente") {
    return (
      <>
        <Menu
          personas={Array.from(
            { length: cantidad },
            () => ({ nombre: "", menu: "" })
          )}
          onEnviar={personas => terminar(cantidad, personas)}
          enviando={enviando}
        />

        {error && (
          <p
            role="alert"
            className="px-5 pb-10 text-center"
            style={{
              backgroundColor: colores.ivory,
              color: colores.burgundy,
            }}
          >
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={() => {
            setPaso("confirmacion");
            setError("");
          }}
          className="block w-full pb-12 text-center underline"
          style={{
            backgroundColor: colores.ivory,
            color: colores.burgundy,
          }}
        >
          {traducir(
            "Volver a la confirmación",
            "Back to RSVP"
          )}
        </button>
      </>
    );
  }

  const respondido = registro.estado !== "pendiente";

  return (
    <section
      id="confirmacion"
      className="px-5 py-20 sm:py-28"
      style={{
        backgroundColor: colores.ivory,
        color: colores.texto,
      }}
    >
      <div
        className="mx-auto max-w-2xl rounded-3xl border px-6 py-10 text-center shadow-xl sm:px-10"
        style={{
          borderColor: colores.burgundy,
          backgroundColor: colores.claro,
        }}
      >
        <p
          className="text-xs uppercase tracking-[0.3em]"
          style={{ color: colores.burgundy }}
        >
          Susana & Gnana
        </p>

        <h2
          className="mt-5 font-serif text-4xl"
          style={{ color: colores.burgundy }}
        >
          {traducir("Confirmación de asistencia", "RSVP")}
        </h2>

        <p className="mt-5 font-serif text-xl">
          {registro.familia}
        </p>

        <p className="mt-2 text-sm">
          {traducir("Pases asignados", "Reserved seats")}:{" "}
          {registro.pases}
        </p>

        {respondido ? (
          <div className="mt-8 font-serif">
            <p
              className="text-lg"
              style={{ color: colores.burgundy }}
            >
              {registro.estado === "declinada"
                ? traducir(
                    "Gracias por responder. Sentiremos tu ausencia.",
                    "Thank you for replying. We will miss you."
                  )
                : traducir(
                    "¡Gracias por confirmar!",
                    "Thank you for confirming!"
                  )}
            </p>

            <p className="mt-3">
              {traducir(
                "Personas confirmadas",
                "Confirmed guests"
              )}
              : {registro.confirmados}
            </p>

            {registro.personas.map((persona, indice) => (
  <div
    key={indice}
    className="mt-5 border-t pt-4 text-sm"
    style={{ borderColor: colores.burgundy }}
  >
    <p className="font-semibold">
      {persona.nombre} ·{" "}
      {String(persona.menu).toLowerCase() === "vegetariano"
        ? traducir("Vegetariano", "Vegetarian")
        : traducir("No vegetariano", "Non-vegetarian")}
    </p>

    {persona.entrada && (
      <p>
        {traducir("Entrada", "Starter")}:{" "}
        {persona.entrada}
      </p>
    )}

    {persona.platoFuerte && (
      <p>
        {traducir("Plato fuerte", "Main course")}:{" "}
        {persona.platoFuerte}
      </p>
    )}

    {persona.postre && (
      <p>
        {traducir("Postre", "Dessert")}:{" "}
        {persona.postre}
      </p>
    )}
  </div>
))}

           {registro.estado === "confirmada" && (
  <div className="mt-8">
    <p className="mb-4 text-sm">
      {traducir(
        "Presenta este QR familiar al llegar al evento.",
        "Show this family QR code when you arrive."
      )}
    </p>

    <div className="inline-block rounded-2xl bg-white p-4 shadow">
      <QRCodeSVG
        value={`https://susana-gnana.vercel.app/acceso?clave=${encodeURIComponent(invitacion.clave)}`}
        size={220}
        level="M"
        marginSize={2}
        fgColor="#6A2C3E"
      />
    </div>

    <p className="mt-3 text-xs">
      {traducir(
        "Un QR por familia",
        "One QR per family"
      )}
    </p>
  </div>
)}
          </div>
        ) : (
          <div className="mt-8 text-left">
            <label
              className="block font-serif text-sm"
              htmlFor="asistencia"
            >
              {traducir(
                "¿Podrán acompañarnos?",
                "Will you join us?"
              )}
            </label>

            <select
              id="asistencia"
              className="mt-2 w-full rounded-xl border bg-white px-4 py-3"
              style={{ borderColor: colores.burgundy }}
              value={asistencia}
              onChange={evento => {
                setAsistencia(evento.target.value);
                setError("");
              }}
            >
              <option value="">
                {traducir(
                  "Selecciona una opción",
                  "Select an option"
                )}
              </option>
              <option value="si">
                {traducir(
                  "Sí asistiré",
                  "Yes, I'll attend"
                )}
              </option>
              <option value="no">
                {traducir(
                  "No podré asistir",
                  "I can't attend"
                )}
              </option>
            </select>

            {asistencia === "si" && (
              <>
                <label
                  className="mt-6 block font-serif text-sm"
                  htmlFor="cantidad-asistentes"
                >
                  {traducir(
                    "¿Cuántas personas asistirán?",
                    "How many guests will attend?"
                  )}
                </label>

                <select
                  id="cantidad-asistentes"
                  className="mt-2 w-full rounded-xl border bg-white px-4 py-3"
                  style={{ borderColor: colores.burgundy }}
                  value={cantidad}
                  onChange={evento =>
                    setCantidad(Number(evento.target.value))
                  }
                >
                  {Array.from(
                    { length: registro.pases },
                    (_, indice) => (
                      <option
                        key={indice + 1}
                        value={indice + 1}
                      >
                        {indice + 1}
                      </option>
                    )
                  )}
                </select>
              </>
            )}

            {error && (
              <p
                role="alert"
                className="mt-4 text-sm"
                style={{ color: colores.burgundy }}
              >
                {error}
              </p>
            )}

            <button
              type="button"
              disabled={!asistencia || enviando}
              onClick={() => {
                if (asistencia === "no") {
                  terminar(0, []);
                } else {
                  setPaso("menu");
                }
              }}
              className="mt-8 w-full rounded-full px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-white disabled:opacity-50"
              style={{ backgroundColor: colores.burgundy }}
            >
              {enviando
                ? traducir("Guardando…", "Saving…")
                : asistencia === "no"
                  ? traducir(
                      "Enviar respuesta",
                      "Submit response"
                    )
                  : traducir(
                      "Continuar al menú",
                      "Continue to menu"
                    )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}