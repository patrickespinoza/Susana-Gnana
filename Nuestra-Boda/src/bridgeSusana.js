// Conserva aquí tu URL real de implementación, terminada en /exec.
export const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxavPvaw6j7hb3gATQfampbKD0KPFhjoxXgCsmMcV2p_T103GIzoM7zx8Mvl5oR0Wva/exec";

let iframe;
let listo;
let receptor;
let origenReceptor;
const pendientes = new Map();

function origenGoogle(origen) {
  try {
    const url = new URL(origen);
    return (
      url.protocol === "https:" &&
      (url.hostname === "script.google.com" ||
        url.hostname.endsWith(".googleusercontent.com"))
    );
  } catch {
    return false;
  }
}

function iniciar() {
  if (listo) return listo;

  listo = new Promise((resolve, reject) => {
    if (!SCRIPT_URL.startsWith("https://script.google.com/macros/s/")) {
      reject(new Error("Configura SCRIPT_URL en src/bridgeSusana.js."));
      listo = undefined;
      return;
    }

    const canal = crypto.randomUUID();
    const url = new URL(SCRIPT_URL);
    url.searchParams.set("canal", canal);

    iframe = document.createElement("iframe");
    iframe.src = url.toString();
    iframe.title = "Conexión de confirmación";
    iframe.style.cssText =
      "position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;border:0";
    iframe.setAttribute("aria-hidden", "true");

    const timeout = setTimeout(() => {
      window.removeEventListener("message", recibir);
      iframe.remove();
      listo = undefined;
      reject(
        new Error(
          "No se pudo conectar con la hoja. Revisa SITE_ORIGINS y la implementación /exec.",
        ),
      );
    }, 20000);

    function recibir(event) {
      const data = event.data || {};

      if (
        data.tipo === "WEDLY_READY" &&
        data.canal === canal &&
        origenGoogle(event.origin)
      ) {
        receptor = event.source;
        origenReceptor = event.origin;
        clearTimeout(timeout);
        resolve();
      }

      if (
        data.tipo === "WEDLY_RESPONSE" &&
        event.source === receptor &&
        event.origin === origenReceptor &&
        pendientes.has(data.peticion)
      ) {
        const pedido = pendientes.get(data.peticion);
        pendientes.delete(data.peticion);
        clearTimeout(pedido.timeout);
        pedido.resolve(data.resultado);
      }
    }

    window.addEventListener("message", recibir);
    document.body.appendChild(iframe);
  });

  return listo;
}

export async function enviarAccion(operacion, payload) {
  await iniciar();

  const peticion = crypto.randomUUID();

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      pendientes.delete(peticion);
      reject(
        new Error(
          "La hoja tardó demasiado en responder. Comprueba el estado antes de intentar de nuevo.",
        ),
      );
    }, 25000);

    pendientes.set(peticion, { resolve, timeout });

    receptor.postMessage(
      { tipo: "WEDLY_REQUEST", peticion, operacion, payload },
      origenReceptor,
    );
  });
}
