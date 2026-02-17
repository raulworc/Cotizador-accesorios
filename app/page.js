'use client'
import { useState, useEffect } from 'react'
import { logoBase64 } from './logo'

export default function CotizadorProfesional() {
  const [cliente, setCliente] = useState('')
  const [items, setItems] = useState([])
  const [proforma, setProforma] = useState('000001')
  const [logoUrl, setLogoUrl] = useState(logoBase64)
  const [historial, setHistorial] = useState([])

  // Cargar historial y última proforma al iniciar
  useEffect(() => {
    const h = localStorage.getItem('historial_rodrigo')
    const p = localStorage.getItem('ultima_proforma_rodrigo')
    if (h) setHistorial(JSON.parse(h))
    if (p) setProforma(p)
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
    const nuevoHistorial = [nuevaEntrada, ...historial].slice(0, 20)
    setHistorial(nuevoHistorial)
    localStorage.setItem('historial_rodrigo', JSON.stringify(nuevoHistorial))
    
    // Incrementar y guardar proforma
    const siguiente = String(parseInt(proforma) + 1).padStart(6, '0')
    setProforma(siguiente)
    localStorage.setItem('ultima_proforma_rodrigo', siguiente)
  }

  const nuevaCotizacion = () => {
    setCliente('')
    setItems([])
  }

  const guardarPDF = () => {
    guardarEnHistorial()
    const nombreArchivo = `Cotizacion_${proforma}_${cliente.replace(/[^a-zA-Z0-9]/g, '_')}`
    const tituloOriginal = document.title
    document.body.classList.add('pdf-mode')
    document.title = nombreArchivo
    window.print()
    document.title = tituloOriginal
    document.body.classList.remove('pdf-mode')
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <div id="cotizacion-pdf" className="contenedor-principal" style={{ maxWidth: '1200px', margin: '0 auto', backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        
        {/* Header ORIGINAL */}
        <div style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a8c 100%)', padding: '1.5rem 1rem', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
              <div className="logo-container" style={{ backgroundColor: 'white', padding: '0.5rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', minHeight: '60px', justifyContent: 'center' }}>
                <img src={logoUrl} alt="Accesorios Rodrigo" style={{ width: 'auto', height: '50px', maxWidth: '180px' }} />
              </div>
              <div className="info-contacto" style={{ fontSize: '0.7rem', lineHeight: 1.4, display: 'block' }}>
                <p style={{ margin: '0.2rem 0', opacity: 0.95 }}>📍 C. Central Km12.5 Lt 67, Ate, Lima</p>
                <p style={{ margin: '0.2rem 0', opacity: 0.95 }}>📞 964194540 | ✉️ olga231702@gmail.com</p>
              </div>
            </div>
            <div className="cotizacion-header" style={{ textAlign: 'right' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, letterSpacing: '0.05em' }}>COTIZACIÓN</h2>
              <p style={{ fontSize: '0.8rem', margin: '0.2rem 0', opacity: 0.9 }}>Fecha: {formatoFecha()}</p>
              <p style={{ fontSize: '0.8rem', margin: 0, opacity: 0.9 }}>N° de Pro-forma: {proforma}</p>
            </div>
          </div>
        </div>

        {/* Cliente ORIGINAL */}
        <div style={{ padding: '1rem', backgroundColor: '#f1f5f9', borderBottom: '2px solid #e2e8f0' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#1e3a5f', marginBottom: '0.4rem' }}>CLIENTE</label>
          <input
            type="text"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            className="screen-only"
            style={{ width: '100%', padding: '0.6rem', border: '2px solid #cbd5e1', borderRadius: '0.4rem', backgroundColor: 'white' }}
          />
          <div className="print-only" style={{ fontSize: '0.95rem', fontWeight: 600 }}>{cliente || 'Nombre del cliente'}</div>
        </div>

        {/* Tabla ORIGINAL */}
        <div style={{ padding: '0 1rem 1rem 1rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem', tableLayout: 'fixed', border: '2px solid #e2e8f0' }}>
            <thead>
              <tr style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a8c 100%)', color: 'white' }}>
                <th style={{ padding: '0.6rem', fontSize: '0.65rem', width: '8%' }}>#</th>
                <th style={{ padding: '0.6rem', fontSize: '0.65rem', textAlign: 'left', width: '42%' }}>DESCRIPCIÓN</th>
                <th style={{ padding: '0.6rem', fontSize: '0.65rem', width: '15%' }}>CANT.</th>
                <th style={{ padding: '0.6rem', fontSize: '0.65rem', width: '17%' }}>P.U.</th>
                <th style={{ padding: '0.6rem', fontSize: '0.65rem', width: '18%' }}>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ textAlign: 'center', fontSize: '0.75rem' }}>{index + 1}</td>
                  <td style={{ padding: '0.4rem' }}>
                    <input type="text" value={item.descripcion} onChange={(e) => actualizarItem(index, 'descripcion', e.target.value)} className="screen-only" style={{ width: '100%', padding: '0.4rem', border: '1px solid #cbd5e1' }} />
                    <span className="print-only">{item.descripcion}</span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <input type="number" value={item.cantidad} onChange={(e) => actualizarItem(index, 'cantidad', e.target.value)} className="screen-only" style={{ width: '100%', textAlign: 'center' }} />
                    <span className="print-only">{item.cantidad}</span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <input type="number" value={item.precioUnitario} onChange={(e) => actualizarItem(index, 'precioUnitario', e.target.value)} className="screen-only" style={{ width: '100%', textAlign: 'center' }} />
                    <span className="print-only">{item.precioUnitario.toFixed(2)}</span>
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 'bold', color: '#2d5a8c' }}>{item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totales y Bancos ORIGINALES */}
        <div style={{ padding: '0.8rem 1rem', background: '#f1f5f9', borderTop: '3px solid #2d5a8c', textAlign: 'right' }}>
          <span style={{ fontWeight: 'bold', color: '#1e3a5f' }}>TOTAL A PAGAR: </span>
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2d5a8c' }}>S/ {totalGeneral.toFixed(2)}</span>
        </div>

        {/* Información Bancaria (Se mantiene tu diseño de 4 columnas) */}
        <div className="info-bancaria" style={{ padding: '1rem', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
             <div style={{ fontSize: '0.7rem' }}><b>BCP Soles:</b> 19138313291092</div>
             <div style={{ fontSize: '0.7rem' }}><b>BCP Inter:</b> 002-19113831329109257</div>
             <div style={{ fontSize: '0.7rem' }}><b>BBVA:</b> 0011-0614-0200143068</div>
             <div style={{ fontSize: '0.7rem' }}><b>Yape:</b> 964194540</div>
          </div>
        </div>

        {/* Botones de Control ORIGINALES */}
        <div className="screen-only" style={{ padding: '1rem', backgroundColor: '#f1f5f9', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.6rem' }}>
          <button onClick={agregarItem} style={{ padding: '0.7rem', backgroundColor: 'white', color: '#2d5a8c', border: '2px solid #2d5a8c', fontWeight: 'bold' }}>+ Agregar producto</button>
          <button onClick={guardarPDF} style={{ padding: '0.7rem', background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', color: 'white', border: 'none', fontWeight: 'bold' }}>💾 Guardar PDF / Historial</button>
          <button onClick={nuevaCotizacion} style={{ padding: '0.7rem', backgroundColor: '#64748b', color: 'white', border: 'none' }}>🔄 Nueva</button>
          <button onClick={() => { if(confirm('¿Borrar historial?')) { localStorage.removeItem('historial_rodrigo'); setHistorial([]); }}} style={{ padding: '0.7rem', backgroundColor: '#dc2626', color: 'white', border: 'none' }}>🗑️ Limpiar Historial</button>
        </div>
      </div>

      {/* HISTORIAL (Añadido al final, fuera del PDF) */}
      <div className="screen-only" style={{ maxWidth: '1200px', margin: '2rem auto', padding: '1rem', backgroundColor: 'white' }}>
        <h3 style={{ borderBottom: '2px solid #1e3a5f', color: '#1e3a5f' }}>📋 Historial de Ventas</h3>
        <table style={{ width: '100%', marginTop: '1rem' }}>
          <thead>
            <tr style={{ textAlign: 'left', fontSize: '0.8rem', color: '#64748b' }}>
              <th>Proforma</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {historial.map((h, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.85rem' }}>
                <td style={{ padding: '0.5rem' }}>{h.proforma}</td>
                <td>{h.cliente}</td>
                <td>{h.fecha}</td>
                <td style={{ fontWeight: 'bold' }}>S/ {h.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print { .screen-only { display: none !important; } .print-only { display: block !important; } }
        @media screen { .print-only { display: none !important; } }
        body.pdf-mode .info-contacto { display: block !important; }
        body.pdf-mode .screen-only { display: none !important; }
      `}} />
    </div>
  )
}
