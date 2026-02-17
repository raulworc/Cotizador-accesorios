'use client'
import { useState, useEffect } from 'react'
import { logoBase64 } from './logo'

export default function CotizadorProfesional() {
  const [cliente, setCliente] = useState('')
  const [items, setItems] = useState([])
  const [proforma, setProforma] = useState('000001')
  const [logoUrl, setLogoUrl] = useState(logoBase64)
  const [historial, setHistorial] = useState([])

  // Cargar historial al iniciar
  useEffect(() => {
    const guardado = localStorage.getItem('historial_rodrigo')
    if (guardado) setHistorial(JSON.parse(guardado))
  }, [])

  const agregarItem = () => {
    setItems([...items, { cantidad: 1, descripcion: '', precioUnitario: 0, total: 0 }])
  }

  const eliminarItem = (index) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const actualizarItem = (index, campo, valor) => {
    const nuevosItems = [...items]
    nuevosItems[index][campo] = campo === 'cantidad' || campo === 'precioUnitario' ? parseFloat(valor) || 0 : valor
    nuevosItems[index].total = nuevosItems[index].cantidad * nuevosItems[index].precioUnitario
    setItems(nuevosItems)
  }

  const totalGeneral = items.reduce((sum, item) => sum + item.total, 0)

  const formatoFecha = () => {
    const hoy = new Date()
    return `${String(hoy.getDate()).padStart(2, '0')}/${String(hoy.getMonth() + 1).padStart(2, '0')}/${hoy.getFullYear()}`
  }

  const guardarEnHistorial = () => {
    if (items.length === 0) return
    const nuevaEntrada = {
      proforma,
      cliente: cliente || 'Sin nombre',
      total: totalGeneral.toFixed(2),
      fecha: formatoFecha()
    }
    const nuevoHistorial = [nuevaEntrada, ...historial].slice(0, 20) // Guarda las últimas 20
    setHistorial(nuevoHistorial)
    localStorage.setItem('historial_rodrigo', JSON.stringify(nuevoHistorial))
    
    // Incrementar proforma automáticamente
    const siguiente = String(parseInt(proforma) + 1).padStart(6, '0')
    setProforma(siguiente)
  }

  const nuevaCotizacion = () => {
    setCliente('')
    setItems([])
  }

  const guardarPDF = () => {
    guardarEnHistorial()
    const nombreArchivo = `Cotizacion_${proforma}_${cliente.replace(/[^a-zA-Z0-9]/g, '_') || 'Cliente'}`
    const tituloOriginal = document.title
    document.body.classList.add('pdf-mode')
    document.title = nombreArchivo
    window.print()
    document.title = tituloOriginal
    document.body.classList.remove('pdf-mode')
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', paddingBottom: '2rem' }}>
      <div id="cotizacion-pdf" className="contenedor-principal" style={{ maxWidth: '1200px', margin: '0 auto', backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a8c 100%)', padding: '1.5rem 1rem', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
              <div className="logo-container" style={{ backgroundColor: 'white', padding: '0.5rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', minHeight: '60px' }}>
                <img src={logoUrl} alt="Accesorios Rodrigo" style={{ width: 'auto', height: '50px' }} />
              </div>
              <div className="info-contacto" style={{ fontSize: '0.7rem', lineHeight: 1.4, display: 'block' }}>
                <p style={{ margin: '0.2rem 0' }}>📍 C. Central Km12.5 Lt 67, Ate, Lima</p>
                <p style={{ margin: '0.2rem 0' }}>📞 964194540 | ✉️ olga231702@gmail.com</p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <h2 style={{ fontSize: '2rem', margin: 0 }}>COTIZACIÓN</h2>
              <p style={{ fontSize: '0.8rem', margin: 0 }}>N°: {proforma}</p>
            </div>
          </div>
        </div>

        {/* Cliente */}
        <div style={{ padding: '1rem', backgroundColor: '#f1f5f9' }}>
          <input
            type="text"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            placeholder="Nombre del cliente"
            className="screen-only"
            style={{ width: '100%', padding: '0.6rem', borderRadius: '0.4rem', border: '2px solid #cbd5e1' }}
          />
          <div className="print-only" style={{ fontWeight: 'bold' }}>Cliente: {cliente || '---'}</div>
        </div>

        {/* Tabla */}
        <div style={{ padding: '1rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#1e3a5f', color: 'white' }}>
                <th style={{ padding: '0.5rem', width: '60%' }}>DESCRIPCIÓN</th>
                <th style={{ padding: '0.5rem' }}>CANT.</th>
                <th style={{ padding: '0.5rem' }}>P.U.</th>
                <th style={{ padding: '0.5rem' }}>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.5rem' }}>
                    <input type="text" value={item.descripcion} onChange={(e) => actualizarItem(index, 'descripcion', e.target.value)} style={{ width: '100%', border: 'none' }} />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <input type="number" value={item.cantidad} onChange={(e) => actualizarItem(index, 'cantidad', e.target.value)} style={{ width: '50px', textAlign: 'center' }} />
                  </td>
                  <td style={{ textAlign: 'center' }}>{item.precioUnitario.toFixed(2)}</td>
                  <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div style={{ padding: '1rem', textAlign: 'right', backgroundColor: '#f8fafc' }}>
          <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>TOTAL: S/ {totalGeneral.toFixed(2)}</span>
        </div>

        {/* Controles */}
        <div className="screen-only" style={{ padding: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <button onClick={agregarItem} style={{ padding: '0.7rem', backgroundColor: '#2d5a8c', color: 'white', borderRadius: '0.4rem' }}>+ Agregar</button>
          <button onClick={guardarPDF} style={{ padding: '0.7rem', backgroundColor: '#059669', color: 'white', borderRadius: '0.4rem' }}>💾 Guardar PDF / Historial</button>
          <button onClick={nuevaCotizacion} style={{ padding: '0.7rem', backgroundColor: '#64748b', color: 'white', borderRadius: '0.4rem' }}>🔄 Nueva</button>
          <button onClick={() => { if(confirm('¿Borrar historial?')) { localStorage.removeItem('historial_rodrigo'); setHistorial([]); }}} style={{ padding: '0.7rem', backgroundColor: '#ef4444', color: 'white', borderRadius: '0.4rem' }}>🗑️ Limpiar Historial</button>
        </div>
      </div>

      {/* SECCIÓN HISTORIAL (Solo visible en pantalla) */}
      <div className="screen-only" style={{ maxWidth: '1200px', margin: '2rem auto', padding: '1rem', backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#1e3a5f', borderBottom: '2px solid #1e3a5f', paddingBottom: '0.5rem' }}>📋 Últimas 20 Cotizaciones</h3>
        <table style={{ width: '100%', marginTop: '1rem', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#64748b' }}>
              <th>N°</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {historial.map((h, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.5rem' }}>{h.proforma}</td>
                <td>{h.cliente}</td>
                <td>{h.fecha}</td>
                <td style={{ fontWeight: 'bold', color: '#059669' }}>S/ {h.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print { .screen-only { display: none !important; } .print-only { display: block !important; } }
        @media screen { .print-only { display: none !important; } }
        body.pdf-mode .info-contacto { display: block !important; }
      `}} />
    </div>
  )
}
