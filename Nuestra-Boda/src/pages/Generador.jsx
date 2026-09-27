import { useState, useRef } from "react";
import { enviarAccion } from "../bridgeSusana";

const colores = {
  ivory: "#D6D2C4",
  blanco: "#EEEAE0",
  burgundy: "#6A2C3E",
  dorado: "#6A2C3E",
  texto: "#392C30",
};

const textos = {
  es: {
    titulo: "Generador de invitaciones",
    intro: "Crea un enlace personalizado para cada familia.",
    idiomaHerramienta: "Idioma del generador",
    familia: "Nombre o familia",
    ejemplo: "Ej. Familia Chávez",
    pases: "Pases asignados",
    idiomaInvitado: "Idioma inicial del invitado",
    ayuda: "Define el mensaje y la vista previa. El invitado podrá cambiar de idioma al abrirla.",
    generar: "Generar enlace",
    compartir: "Invitación para compartir",
    completar: "Completa los datos y genera el enlace.",
    enlace: "Enlace personalizado",
    copiarEnlace: "Copiar enlace",
    mensaje: "Mensaje editable",
    copiarMensaje: "Copiar mensaje",
    errorNombre: "Escribe un nombre o familia de hasta 100 caracteres.",
    errorPases: "Ingresa entre 1 y 50 pases.",
    copiado: "copiado.",
    errorCopiar: "No se pudo copiar. Selecciona y copia el texto manualmente.",
  },
  en: {
    titulo: "Invitation generator",
    intro: "Create a personalized link for each family.",
    idiomaHerramienta: "Generator language",
    familia: "Guest or family name",
    ejemplo: "E.g. The Chavez Family",
    pases: "Reserved seats",
    idiomaInvitado: "Guest's initial language",
    ayuda: "Sets the message and link preview. Guests can change languages when they open it.",
    generar: "Generate link",
    compartir: "Invitation to share",
    completar: "Enter the details and generate the link.",
    enlace: "Personalized link",
    copiarEnlace: "Copy link",
    mensaje: "Editable message",
    copiarMensaje: "Copy message",
    errorNombre: "Enter a guest or family name of up to 100 characters.",
    errorPases: "Enter between 1 and 50 seats.",
    copiado: "copied.",
    errorCopiar: "Could not copy. Select and copy the text manually.",
  },
};

function codificarInvitacion(datos) {
  const invertido = JSON.stringify(datos).split("").reverse().join("");
  const bytes = new TextEncoder().encode(invertido);
  let binario = "";
  bytes.forEach((byte) => { binario += String.fromCharCode(byte); });
  return btoa(binario).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export default function Generador() {
  const [nombre, setNombre] = useState("");
  const [pases, setPases] = useState("1");
  const [idiomaInterfaz, setIdiomaInterfaz] = useState("es");
  const [idiomaInvitado, setIdiomaInvitado] = useState("es");
  const [link, setLink] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [aviso, setAviso] = useState("");
  const [guardando, setGuardando] = useState(false);
  const borrador = useRef(null);
  const t = textos[idiomaInterfaz];

  function invalidar() {
    borrador.current = null;
    setLink("");
    setMensaje("");
    setAviso("");
  }

  async function generar() {
    if (guardando) return;
    const familia = nombre.trim().replace(/\s+/g, " ");
    const cantidad = Number(pases);
    if (!familia || familia.length > 100) {
      setAviso(t.errorNombre);
      return;
    }
    if (!Number.isSafeInteger(cantidad) || cantidad < 1 || cantidad > 50) {
      setAviso(t.errorPases);
      return;
    }

    const clave = borrador.current || crypto.randomUUID();
    borrador.current = clave;
    setGuardando(true);
    setAviso("");
    try {
      const respuesta = await enviarAccion("registrar", { clave, nombre: familia, pases: cantidad, idioma: idiomaInvitado });
      if (!respuesta?.ok) throw new Error(respuesta?.error || "No se pudo registrar la invitación.");
    } catch (error) {
      setAviso(error.message);
      setGuardando(false);
      return;
    }
    setGuardando(false);
    const id = codificarInvitacion({ clave, nombre: familia, pases: cantidad });
    const ruta = idiomaInvitado === "en" ? "/en.html" : "/";
    const url = `${window.location.origin}${ruta}?id=${encodeURIComponent(id)}`;
    const texto = idiomaInvitado === "en"
      ? `Dear ${familia},\n\nSusana & Gnana invite you to celebrate their wedding on February 14, 2027 at 5:00 PM.\n\nWe have reserved ${cantidad} ${cantidad === 1 ? "seat" : "seats"} for you. Please open your invitation and confirm your attendance:\n${url}\n\nWith love,\nSusana & Gnana`
      : `Hola ${familia}:\n\nSusana y Gnana te invitan a celebrar su boda el 14 de febrero de 2027 a las 5:00 p. m.\n\nHemos reservado ${cantidad} ${cantidad === 1 ? "lugar" : "lugares"} para ti. Abre la invitación y confirma tu asistencia:\n${url}\n\nCon cariño,\nSusana y Gnana`;
    setLink(url);
    setMensaje(texto);
    setAviso("");
  }

  async function copiar(valor, etiqueta) {
    try {
      await navigator.clipboard.writeText(valor);
      setAviso(`${etiqueta} ${t.copiado}`);
    } catch {
      setAviso(t.errorCopiar);
    }
  }

  const campo = "mt-2 w-full rounded-xl border bg-white px-4 py-3 font-serif text-base outline-none focus:ring-2";

  return (
    <main lang={idiomaInterfaz} className="min-h-screen px-5 py-12 sm:py-20" style={{ backgroundColor: colores.ivory, color: colores.texto }}>
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[0.3em]" style={{ color: colores.burgundy }}>Susana & Gnana</p>
          <h1 className="mt-4 font-serif text-4xl sm:text-5xl" style={{ color: colores.burgundy }}>{t.titulo}</h1>
          <p className="mt-4 font-serif text-sm">{t.intro}</p>
        </header>

        <div className="grid gap-8 lg:grid-cols-2">
          <section className="rounded-3xl border p-6 shadow-lg sm:p-8" style={{ backgroundColor: colores.blanco, borderColor: colores.dorado }}>
            <label className="block text-sm font-medium" htmlFor="idioma-interfaz">{t.idiomaHerramienta}</label>
            <select id="idioma-interfaz" className={campo} style={{ borderColor: colores.dorado }} value={idiomaInterfaz} onChange={(e) => { setIdiomaInterfaz(e.target.value); setAviso(""); }}>
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
            <label className="mt-6 block text-sm font-medium" htmlFor="familia">{t.familia}</label>
            <input id="familia" className={campo} style={{ borderColor: colores.dorado }} placeholder={t.ejemplo} value={nombre} onChange={(e) => { setNombre(e.target.value); invalidar(); }} />

            <label className="mt-6 block text-sm font-medium" htmlFor="pases">{t.pases}</label>
            <input id="pases" type="number" min="1" max="50" step="1" inputMode="numeric" className={campo} style={{ borderColor: colores.dorado }} value={pases} onChange={(e) => { setPases(e.target.value); invalidar(); }} />

            <label className="mt-6 block text-sm font-medium" htmlFor="idioma">{t.idiomaInvitado}</label>
            <select id="idioma" className={campo} style={{ borderColor: colores.dorado }} value={idiomaInvitado} onChange={(e) => { setIdiomaInvitado(e.target.value); invalidar(); }}>
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
            <p className="mt-2 text-xs">{t.ayuda}</p>

            <button type="button" onClick={generar} disabled={guardando} className="mt-8 w-full rounded-full px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-white disabled:opacity-50" style={{ backgroundColor: colores.burgundy }}>
              {guardando ? (idiomaInterfaz === "en" ? "Saving…" : "Guardando…") : t.generar}
            </button>
            {aviso && <p role="status" className="mt-4 text-sm" style={{ color: colores.burgundy }}>{aviso}</p>}
          </section>

          <section className="rounded-3xl border p-6 shadow-lg sm:p-8" style={{ backgroundColor: colores.blanco, borderColor: colores.dorado }}>
            <h2 className="font-serif text-2xl" style={{ color: colores.burgundy }}>{t.compartir}</h2>
            {!link ? (
              <p className="mt-6 font-serif text-sm">{t.completar}</p>
            ) : (
              <>
                <label className="mt-6 block text-xs uppercase tracking-widest" htmlFor="enlace-generado">{t.enlace}</label>
                <textarea id="enlace-generado" readOnly rows={4} value={link} className="mt-2 w-full resize-none break-all rounded-xl border p-3 text-xs" style={{ borderColor: colores.dorado }} />
                <button type="button" onClick={() => copiar(link, t.enlace)} className="mt-2 rounded-full border px-5 py-2 text-xs" style={{ borderColor: colores.burgundy, color: colores.burgundy }}>{t.copiarEnlace}</button>
                <label className="mt-7 block text-xs uppercase tracking-widest" htmlFor="mensaje-generado">{t.mensaje}</label>
                <textarea id="mensaje-generado" rows={13} value={mensaje} onChange={(e) => setMensaje(e.target.value)} className="mt-2 w-full rounded-xl border p-3 text-sm leading-6" style={{ borderColor: colores.dorado }} />
                <button type="button" onClick={() => copiar(mensaje, t.mensaje)} className="mt-2 rounded-full px-5 py-3 text-xs text-white" style={{ backgroundColor: colores.burgundy }}>{t.copiarMensaje}</button>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}