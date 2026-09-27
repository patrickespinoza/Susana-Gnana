
import { useState } from "react";
import { useIdioma } from "../context/IdiomaContext";

const colores = { ivory: "#D6D2C4", claro: "#EEEAE0", burgundy: "#6A2C3E", texto: "#392C30" };
const grupos = [
  { campo: "entrada", titulo: ["Entrada", "Starter"], platos: [
    { id: "queso_cabra", foto: { es: 4, en: 4 }, nombre: ["Crujiente de queso de cabra y tomate deshidratado", "Goat Cheese Crisp"] },
    { id: "crema_quesos", foto: { es: 5, en: 5 }, nombre: ["Crema de 3 quesos con uva", "Three Cheese Cream"] },
  ] },
  { campo: "platoFuerte", titulo: ["Plato fuerte", "Main course"], platos: [
    { id: "pechuga_panela", foto: { es: 2, en: 6 }, nombre: ["Pechuga rellena de panela con mole Xico", "Chicken Breast with Panela Cheese"] },
    { id: "pechuga_almendras", foto: { es: 3, en: 3 }, nombre: ["Pechuga de pollo rellena de queso crema y almendras", "Chicken Breast with Cream Cheese and Almonds"] },
  ] },
  { campo: "postre", titulo: ["Postre", "Dessert"], platos: [
    { id: "cono_almendras", foto: { es: 1, en: 1 }, nombre: ["Cono de almendras", "Almond Tuile Cone"] },
    { id: "copa_chocolate", foto: { es: 6, en: 2 }, nombre: ["Copa de chocolate con coco", "Chocolate Coconut Cup"] },
  ] },
];

export default function Menu({ personas = [], onEnviar, enviando = false }) {
  const { idioma } = useIdioma();
  const en = idioma === "en";
  const t = (es, ingles) => en ? ingles : es;
  const [respuestas, setRespuestas] = useState(() => personas.map(p => ({
    nombre: p.nombre || "", menu: "", entrada: "", platoFuerte: "", postre: "",
  })));
  const [error, setError] = useState("");

  function cambiar(indice, cambio) {
    setRespuestas(actuales => actuales.map((p, i) => i === indice ? { ...p, ...cambio } : p));
    setError("");
  }

  function enviar(evento) {
    evento.preventDefault();
    const nombres = respuestas.map(p => p.nombre.trim().replace(/\s+/g, " ").toLocaleLowerCase("es"));
    if (new Set(nombres).size !== nombres.length) {
      setError(t("Escribe un nombre diferente para cada asistente.", "Enter a different name for each guest."));
      return;
    }
    if (respuestas.some(p => !p.nombre.trim() || !p.menu ||
      (p.menu === "no_vegetariano" && (!p.entrada || !p.platoFuerte || !p.postre)))) {
      setError(t("Completa el nombre y los platillos de cada asistente.", "Complete each guest's name and dish selections."));
      return;
    }
    onEnviar?.(respuestas.map(p => ({
      nombre: p.nombre.trim().replace(/\s+/g, " "), menu: p.menu,
      entrada: p.menu === "no_vegetariano" ? p.entrada : "",
      platoFuerte: p.menu === "no_vegetariano" ? p.platoFuerte : "",
      postre: p.menu === "no_vegetariano" ? p.postre : "",
    })));
  }

  return (
    <section id="menu" className="px-5 py-16 sm:px-8 sm:py-24" style={{ backgroundColor: colores.ivory, color: colores.texto }}>
      <div className="mx-auto max-w-5xl">
        <header className="mx-auto max-w-2xl text-center">
          <img src="/pareja-menu.jpg" alt={t("Susana y Gnana", "Susana and Gnana")} onError={e => { e.currentTarget.style.display = "none"; }} className="mx-auto mb-8 h-72 w-full rounded-2xl object-cover shadow-lg sm:h-96" />
          <p className="text-xs uppercase tracking-[0.3em]" style={{ color: colores.burgundy }}>Susana & Gnana</p>
          <h2 className="mt-4 font-serif text-4xl" style={{ color: colores.burgundy }}>{t("Elige tu menú", "Choose your menu")}</h2>
          <p className="mt-4 font-serif">{t("Cada persona elige su propio menú.", "Each guest chooses their own menu.")}</p>
        </header>
        <form onSubmit={enviar} className="mx-auto mt-10 max-w-3xl space-y-8">
          {respuestas.map((persona, i) => (
            <fieldset key={i} className="rounded-2xl border p-5 sm:p-7" style={{ borderColor: colores.burgundy, backgroundColor: colores.claro }}>
              <legend className="px-2 font-serif text-xl" style={{ color: colores.burgundy }}>{t(`Asistente ${i + 1}`, `Guest ${i + 1}`)}</legend>
              <label htmlFor={`nombre-menu-${i}`} className="block font-serif">{t("Nombre completo", "Full name")}</label>
              <input id={`nombre-menu-${i}`} type="text" maxLength={100} required value={persona.nombre} onChange={e => cambiar(i, { nombre: e.target.value })} className="mt-2 w-full rounded-xl border bg-white px-4 py-3" style={{ borderColor: colores.burgundy }} />
              <p className="mt-6 font-serif">{t("Tipo de menú", "Menu type")}</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {[["vegetariano", t("Vegetariano", "Vegetarian")], ["no_vegetariano", t("No vegetariano", "Non-vegetarian")]].map(([valor, etiqueta]) => (
                  <label key={valor} className="flex cursor-pointer items-center gap-3 rounded-xl border p-4 font-serif" style={{ borderColor: colores.burgundy, backgroundColor: persona.menu === valor ? colores.ivory : "white" }}>
                    <input type="radio" name={`menu-${i}`} checked={persona.menu === valor} onChange={() => cambiar(i, { menu: valor, entrada: "", platoFuerte: "", postre: "" })} required style={{ accentColor: colores.burgundy }} />{etiqueta}
                  </label>
                ))}
              </div>
              {persona.menu === "vegetariano" && (
                <div className="mt-6">
                  <p className="mb-3 font-serif">{t("Menú vegetariano completo", "Complete vegetarian menu")}</p>
                  <img src={`/menu/vegetariano-${en ? "en" : "es"}.jpeg`} alt={t("Menú vegetariano", "Vegetarian menu")} className="mx-auto max-h-[750px] w-full rounded-xl object-contain" />
                </div>
              )}
              {persona.menu === "no_vegetariano" && grupos.map(grupo => (
                <fieldset key={grupo.campo} className="mt-7 border-t pt-6" style={{ borderColor: colores.burgundy }}>
                  <legend className="font-serif text-xl" style={{ color: colores.burgundy }}>{grupo.titulo[en ? 1 : 0]}</legend>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {grupo.platos.map(plato => (
                      <label key={plato.id} className="cursor-pointer overflow-hidden rounded-xl border p-3" style={{ borderColor: colores.burgundy, backgroundColor: persona[grupo.campo] === plato.id ? colores.ivory : "white" }}>
                        <img src={`/menu/normal-${en ? "en" : "es"}-${plato.foto[en ? "en" : "es"]}.jpeg`} alt={plato.nombre[en ? 1 : 0]} loading="lazy" className="w-full rounded-lg object-contain" />
                        <span className="mt-3 flex items-center gap-2 font-serif text-sm">
                          <input type="radio" name={`${grupo.campo}-${i}`} checked={persona[grupo.campo] === plato.id} onChange={() => cambiar(i, { [grupo.campo]: plato.id })} required style={{ accentColor: colores.burgundy }} />
                          {plato.nombre[en ? 1 : 0]}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
            </fieldset>
          ))}
          {error && <p role="alert" className="text-center" style={{ color: colores.burgundy }}>{error}</p>}
          <button type="submit" disabled={enviando || !respuestas.length || !onEnviar} className="w-full rounded-full px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-white disabled:opacity-50" style={{ backgroundColor: colores.burgundy }}>
            {enviando ? t("Enviando…", "Submitting…") : t("Enviar confirmación y menús", "Submit RSVP and menus")}
          </button>
        </form>
      </div>
    </section>
  );
}