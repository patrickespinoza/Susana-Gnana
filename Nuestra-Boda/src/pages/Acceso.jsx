import { useEffect, useState } from "react";
import { enviarAccion } from "../bridgeSusana";

const colores = {
  ivory: "#D6D2C4",
  claro: "#EEEAE0",
  burgundy: "#6A2C3E",
  texto: "#392C30",
};

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default function Acceso() {
  const clave =
    new URLSearchParams(window.location.search).get("clave") || "";

  const [registro, setRegistro] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [pin, setPin] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    let activo = true;

    if (!UUID.test(clave)) {
      setError("Código QR inválido.");
      setCargando(false);
      return;
    }

    enviarAccion("consultar", { clave })
      .then(respuesta => {
        if (!activo) return;

        if (!respuesta?.ok) {
          throw new Error(
            respuesta?.error || "No se encontró la invitación."
          );
        }

        setRegistro(respuesta);
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
  }, [clave]);

  async function registrarEntrada(evento) {
    evento.preventDefault();

    if (guardando || !registro || registro.entrada) return;

    setGuardando(true);
    setError("");
    setMensaje("");

    try {
      const respuesta = await enviarAccion("entrada", {
        clave,
        pin,
      });

      if (!respuesta?.ok) {
        throw new Error(
          respuesta?.error || "No se pudo registrar la entrada."
        );
      }

      const actual = await enviarAccion("consultar", {
        clave,
      });

      if (!actual?.ok) {
        throw new Error(
          actual?.error || "No se pudo actualizar el estado."
        );
      }

      setRegistro(actual);
      setPin("");
      setMensaje("Entrada familiar registrada en la hoja.");
    } catch (err) {
      // Si se guardó antes de un fallo de red, evitamos repetir el registro.
      try {
        const actual = await enviarAccion("consultar", {
          clave,
        });

        if (actual?.ok && actual.entrada) {
          setRegistro(actual);
          setPin("");
          setMensaje(
            "La entrada ya quedó registrada en la hoja."
          );
          return;
        }
      } catch {
        // Conservamos el error inicial.
      }

      setError(err.message);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <main
      className="min-h-screen px-5 py-12 sm:py-20"
      style={{
        backgroundColor: colores.ivory,
        color: colores.texto,
      }}
    >
      <section
        className="mx-auto max-w-xl rounded-3xl border p-6 shadow-xl sm:p-10"
        style={{
          borderColor: colores.burgundy,
          backgroundColor: colores.claro,
        }}
      >
        <p
          className="text-center text-xs uppercase tracking-[0.3em]"
          style={{ color: colores.burgundy }}
        >
          Susana & Gnana
        </p>

        <h1
          className="mt-4 text-center font-serif text-4xl"
          style={{ color: colores.burgundy }}
        >
          Control de acceso
        </h1>

        {cargando && (
          <p className="mt-8 text-center">
            Consultando invitación…
          </p>
        )}

        {!cargando && registro && (
          <>
            <h2 className="mt-8 text-center font-serif text-2xl">
              {registro.familia}
            </h2>

            <dl className="mt-8 grid grid-cols-2 gap-4 text-center">
              <div
                className="rounded-xl p-4"
                style={{
                  backgroundColor: colores.ivory,
                }}
              >
                <dt className="text-xs uppercase tracking-wider">
                  Pases asignados
                </dt>
                <dd className="mt-2 font-serif text-3xl">
                  {registro.pases}
                </dd>
              </div>

              <div
                className="rounded-xl p-4"
                style={{
                  backgroundColor: colores.ivory,
                }}
              >
                <dt className="text-xs uppercase tracking-wider">
                  Confirmados
                </dt>
                <dd className="mt-2 font-serif text-3xl">
                  {registro.confirmados}
                </dd>
              </div>
            </dl>

            <p className="mt-6 text-center font-serif">
              Estado:{" "}
              <strong>
                {registro.estado === "confirmada"
                  ? "Confirmada"
                  : registro.estado === "declinada"
                    ? "No asistirán"
                    : "Pendiente"}
              </strong>
            </p>

            {registro.personas?.length > 0 && (
              <ul className="mt-5 list-inside list-disc text-sm">
                {registro.personas.map(
                  (persona, indice) => (
                    <li key={indice}>
                      {persona.nombre}
                    </li>
                  )
                )}
              </ul>
            )}

            {registro.entrada ? (
              <p
                className="mt-8 rounded-xl p-4 text-center font-semibold"
                style={{
                  backgroundColor: colores.ivory,
                  color: colores.burgundy,
                }}
              >
                Entrada ya registrada ·{" "}
                {registro.ingresados} personas
              </p>
            ) : registro.estado === "confirmada" ? (
              <form
                onSubmit={registrarEntrada}
                className="mt-8"
              >
                <label
                  className="block text-sm"
                  htmlFor="host-pin"
                >
                  Clave de la host
                </label>

                <input
                  id="host-pin"
                  type="password"
                  autoComplete="off"
                  required
                  value={pin}
                  onChange={evento =>
                    setPin(evento.target.value)
                  }
                  className="mt-2 w-full rounded-xl border bg-white px-4 py-3"
                  style={{
                    borderColor: colores.burgundy,
                  }}
                />

                <button
                  type="submit"
                  disabled={guardando}
                  className="mt-4 w-full rounded-full px-5 py-4 text-sm font-semibold text-white disabled:opacity-50"
                  style={{
                    backgroundColor: colores.burgundy,
                  }}
                >
                  {guardando
                    ? "Registrando…"
                    : "Registrar entrada familiar"}
                </button>
              </form>
            ) : (
              <p className="mt-8 text-center text-sm">
                Esta familia no tiene asistentes confirmados.
              </p>
            )}
          </>
        )}

        {mensaje && (
          <p
            role="status"
            className="mt-5 text-center text-sm"
            style={{ color: colores.burgundy }}
          >
            {mensaje}
          </p>
        )}

        {error && (
          <p
            role="alert"
            className="mt-5 text-center text-sm"
            style={{ color: colores.burgundy }}
          >
            {error}
          </p>
        )}
      </section>
    </main>
  );
}