'use client'
import { useState, useEffect } from 'react'
import { logoBase64 } from './logo'

export default function CotizadorProfesional() {
  const [cliente, setCliente] = useState('')
  const [items, setItems] = useState([])
  const [proforma, setProforma] = useState('000001')
  const [logoUrl, setLogoUrl] = useState(logoBase64)
  const [historial, setHistorial] = useState([])

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

  const guardarEnHistorial = () => {
    if (items.length === 0) return
    const nuevaEntrada = {
      proforma,
      cliente: cliente || '---',
      total: totalGeneral.toFixed(2),
      fecha: new Date().toLocaleDateString()
    }
    const nuevoHistorial = [nuevaEntrada, ...historial].slice(0, 20)
    setHistorial(nuevoHistorial)
    localStorage.setItem('historial_rodrigo', JSON.stringify(nuevoHistorial))
    
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
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', paddingBottom: '2rem' }}>
      <div id="cotizacion-pdf" className="contenedor-principal" style={{ maxWidth: '1000px', margin: '0 auto', backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        
        {/* Header */}
        <div className="header-diseno" style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a8c 100%)', padding: '1rem', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ backgroundColor: 'white', padding: '0.4rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center' }}>
                <img src={logoUrl} alt="Accesorios Rodrigo" style={{ height: '50px', width: 'auto' }} />
              </div>
              <div className="info-contacto" style={{ fontSize: '0.75rem', lineHeight: '1.4' }}>
                <p style={{ margin: 0 }}>📍 C. Central Km12.5 Lt 67, Ate, Lima</p>
                <p style={{ margin: 0 }}>📞 964194540 | ✉️ olga231702@gmail.com</p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold', margin: 0, letterSpacing: '0.05em' }}>COTIZACIÓN</h2>
              <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.9 }}>Fecha: {new Date().toLocaleDateString()}</p>
              <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 'bold' }}>N° de Pro-forma: {proforma}</p>
            </div>
          </div>
        </div>

        {/* Sección Cliente */}
        <div style={{ padding: '0.8rem 1.2rem', backgroundColor: '#f1f5f9', borderBottom: '2px solid #e2e8f0' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#1e3a5f', marginBottom: '0.2rem' }}>CLIENTE</label>
          <input
            type="text"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            className="screen-only"
            placeholder="Nombre del cliente"
            style={{ width: '100%', padding: '0.5rem', border: '2px solid #cbd5e1', borderRadius: '0.4rem' }}
          />
          <div className="print-only" style={{ fontSize: '1rem', fontWeight: 'bold', color: '#1e293b' }}>{cliente || '---'}</div>
        </div>

        {/* Tabla */}
        <div style={{ padding: '1rem 1.5rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '2px solid #e2e8f0' }}>
            <thead>
              <tr style={{ background: '#1e3a5f', color: 'white' }}>
                <th style={{ padding: '0.6rem', width: '70px', border: '1px solid #2d5a8c', fontSize: '0.8rem' }}>CANT.</th>
                <th style={{ textAlign: 'left', padding: '0.6rem', border: '1px solid #2d5a8c', fontSize: '0.8rem' }}>DESCRIPCIÓN</th>
                <th style={{ width: '75px', padding: '0.6rem', border: '1px solid #2d5a8c', fontSize: '0.8rem' }}>P.U.</th>
                <th style={{ width: '120px', padding: '0.6rem', border: '1px solid #2d5a8c', fontSize: '0.8rem' }}>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Agregue productos</td></tr>
              ) : (
                items.map((item, index) => (
                  <tr key={index} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f8fafc' }}>
                    <td style={{ textAlign: 'center', border: '1px solid #e2e8f0' }}>
                      <input type="number" value={item.cantidad} onChange={(e) => actualizarItem(index, 'cantidad', e.target.value)} className="screen-only" style={{ width: '55px', padding: '0.4rem', textAlign: 'center', border: '1px solid #cbd5e1' }} />
                      <span className="print-only" style={{ fontSize: '0.85rem' }}>{item.cantidad}</span>
                    </td>
                    <td style={{ padding: '0.4rem', border: '1px solid #e2e8f0' }}>
                      <input type="text" value={item.descripcion} onChange={(e) => actualizarItem(index, 'descripcion', e.target.value)} className="screen-only" style={{ width: '100%', padding: '0.4rem', border: '1px solid #cbd5e1', borderRadius: '0.3rem' }} />
                      <span className="print-only" style={{ fontSize: '0.85rem' }}>{item.descripcion}</span>
                    </td>
                    <td style={{ textAlign: 'center', border: '1px solid #e2e8f0' }}>
                      <input type="number" value={item.precioUnitario} onChange={(e) => actualizarItem(index, 'precioUnitario', e.target.value)} className="screen-only" style={{ width: '100%', padding: '0.4rem', textAlign: 'center', border: 'none' }} />
                      <span className="print-only" style={{ fontSize: '0.85rem' }}>{item.precioUnitario.toFixed(2)}</span>
                    </td>
                    <td style={{ textAlign: 'center', border: '1px solid #e2e8f0', fontWeight: 'bold', color: '#1e3a5f' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                        <span style={{ fontSize: '0.95rem' }}>{item.total.toFixed(2)}</span>
                        <button onClick={() => eliminarItem(index)} className="screen-only" style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }}>✕</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={{ padding: '1rem 1.5rem', background: '#f8fafc', borderTop: '2px solid #2d5a8c' }}>
          <div style={{ textAlign: 'right', marginBottom: '0.2rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#1e3a5f' }}>TOTAL A PAGAR: </span>
            <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#2d5a8c' }}>S/ </span>
            <span style={{ fontSize: '2.2rem', fontWeight: 'bold', color: '#2d5a8c', lineHeight: 1 }}>{totalGeneral.toFixed(2)}</span>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.8rem', fontStyle: 'italic' }}>
            ⏰ Válido por 7 días
          </div>
          <div className="cuentas-bancarias" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.8rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.8rem' }}>
            <div style={{ fontSize: '0.85rem', lineHeight: '1.2' }}><b>BCP Soles:</b><br/>19138313291092</div>
            <div style={{ fontSize: '0.85rem', lineHeight: '1.2' }}><b>BCP Inter:</b><br/>002-19113831329109257</div>
            <div style={{ fontSize: '0.85rem', lineHeight: '1.2' }}><b>BBVA:</b><br/>0011-0614-0200143068</div>
            <div style={{ fontSize: '0.85rem', lineHeight: '1.2' }}><b>Yape:</b><br/><span style={{ fontSize: '1.05rem', fontWeight: 'bold' }}>964194540</span></div>
          </div>
        </div>

        {/* Controles */}
        <div className="screen-only" style={{ padding: '1.2rem', backgroundColor: '#f1f5f9', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
          <button onClick={agregarItem} style={{ padding: '0.7rem', backgroundColor: 'white', color: '#2d5a8c', border: '2px solid #2d5a8c', fontWeight: 'bold', borderRadius: '0.4rem' }}>+ Agregar producto</button>
          <button onClick={guardarPDF} style={{ padding: '0.7rem', background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', color: 'white', border: 'none', fontWeight: 'bold', borderRadius: '0.4rem' }}>💾 Guardar PDF / Historial</button>
          <button onClick={nuevaCotizacion} style={{ padding: '0.7rem', backgroundColor: '#64748b', color: 'white', border: 'none', borderRadius: '0.4rem' }}>🔄 Nueva</button>
          <button onClick={() => { if(confirm('¿Limpiar historial?')) { localStorage.removeItem('historial_rodrigo'); setHistorial([]); }}} style={{ padding: '0.7rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '0.4rem' }}>🗑️ Limpiar Historial</button>
        </div>
      </div>

      <div className="screen-only historial-seccion" style={{ maxWidth: '1000px', margin: '2rem auto', padding: '1.5rem', backgroundColor: 'white' }}>
        <h3 style={{ borderBottom: '2px solid #1e3a5f', color: '#1e3a5f' }}>📋 Historial de Ventas</h3>
        <table style={{ width: '100%', marginTop: '1rem', fontSize: '0.9rem' }}>
          <tbody>
            {historial.map((h, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.6rem' }}>{h.proforma} - {h.cliente}</td>
                <td style={{ textAlign: 'right', fontWeight: 'bold' }}>S/ {h.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { margin: 0; size: auto; }
          body { margin: 1cm !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .screen-only, .historial-seccion { display: none !important; visibility: hidden !important; height: 0 !important; overflow: hidden !important; }
          .print-only { display: block !important; }
          .contenedor-principal { 
            box-shadow: none !important; 
            margin: 0 !important; 
            width: 100% !important; 
            max-width: none !important; 
          }
          .header-diseno { background: linear-gradient(135deg, #1e3a5f 0%, #2d5a8c 100%) !important; color: white !important; -webkit-print-color-adjust: exact; }
          th { background-color: #1e3a5f !important; color: white !important; -webkit-print-color-adjust: exact; }
        }
        @media screen { .print-only { display: none !important; } }
      `}} />
    </div>
  )
}
