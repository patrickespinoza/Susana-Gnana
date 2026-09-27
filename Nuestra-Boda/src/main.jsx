import { useState } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Portada from './componentes-encabezado/portada'
import PaginaPrincipal from './PaginaPrincipal'
import Generador from './pages/Generador'

import { IdiomaProvider } from './context/IdiomaContext'
import SelectorIdioma from './componentes-encabezado/SelectorIdioma'

import Acceso from "./pages/Acceso";

function ContenidoInvitacion() {
  const [idiomaSeleccionado, setIdiomaSeleccionado] = useState(false)

  if (!idiomaSeleccionado) {
    return (
      <SelectorIdioma
        onContinuar={() => setIdiomaSeleccionado(true)}
      />
    )
  }

  return (
    <>
      <Portada />
      <PaginaPrincipal />
    </>
  )
}

function Invitacion() {
  return (
    <IdiomaProvider>
      <ContenidoInvitacion />
    </IdiomaProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      {/* Enlace con vista previa en español */}
      <Route path="/" element={<Invitacion />} />

      {/* Enlace con vista previa en inglés */}
      <Route path="/en.html" element={<Invitacion />} />

      {/* Generador */}
      <Route path="/generador" element={<Generador />} />

      <Route path="/acceso" element={<Acceso />} />
    </Routes>
  </BrowserRouter>
)