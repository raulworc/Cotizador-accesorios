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
      <div id="cotizacion-pdf" className="contenedor-principal" style={{ maxWidth: '900px', margin: '0 auto', backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        
        {/* Header Compacto */}
        <div className="header-diseno" style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a8c 100%)', padding: '0.8rem 1rem', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <div style={{ backgroundColor: 'white', padding: '0.3rem', borderRadius: '0.4rem', display: 'flex', alignItems: 'center' }}>
                <img src={logoUrl} alt="Accesorios Rodrigo" style={{ height: '40px', width: 'auto' }} />
              </div>
              <div className="info-contacto" style={{ fontSize: '0.65rem', lineHeight: '1.2' }}>
                <p style={{ margin: 0 }}>📍 C. Central Km12.5 Lt 67, Ate, Lima</p>
                <p style={{ margin: 0 }}>📞 964194540 | ✉️ olga231702@gmail.com</p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', margin: 0 }}>COTIZACIÓN</h2>
              <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.9 }}>Fecha: {new Date().toLocaleDateString()} | N°: {proforma}</p>
            </div>
          </div>
        </div>

        {/* Cliente */}
        <div style={{ padding: '0.5rem 1rem', backgroundColor: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
          <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 'bold', color: '#1e3a5f' }}>CLIENTE</label>
          <input
            type="text"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            className="screen-only"
            placeholder="Nombre del cliente"
            style={{ width: '100%', padding: '0.3rem', border: '1px solid #cbd5e1', borderRadius: '0.3rem' }}
          />
          <div className="print-only" style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{cliente || '---'}</div>
        </div>

        {/* Tabla Optimizada */}
        <div style={{ padding: '0.5rem 1rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e2e8f0' }}>
            <thead>
              <tr style={{ background: '#1e3a5f', color: 'white' }}>
                <th style={{ padding: '0.4rem', width: '60px', border: '1px solid #2d5a8c', fontSize: '0.7rem' }}>CANT.</th>
                <th style={{ textAlign: 'left', padding: '0.4rem', border: '1px solid #2d5a8c', fontSize: '0.7rem' }}>DESCRIPCIÓN</th>
                <th style={{ width: '70px', padding: '0.4rem', border: '1px solid #2d5a8c', fontSize: '0.7rem' }}>P.U.</th>
                <th style={{ width: '100px', padding: '0.4rem', border: '1px solid #2d5a8c', fontSize: '0.7rem' }}>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f8fafc' }}>
                  <td style={{ textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <input type="number" value={item.cantidad} onChange={(e) => actualizarItem(index, 'cantidad', e.target.value)} className="screen-only" style={{ width: '40px', textAlign: 'center' }} />
                    <span className="print-only" style={{ fontSize: '0.8rem' }}>{item.cantidad}</span>
                  </td>
                  <td style={{ padding: '0.2rem 0.4rem', border: '1px solid #e2e8f0' }}>
                    <input type="text" value={item.descripcion} onChange={(e) => actualizarItem(index, 'descripcion', e.target.value)} className="screen-only" style={{ width: '100%', border: 'none' }} />
                    <span className="print-only" style={{ fontSize: '0.8rem' }}>{item.descripcion}</span>
                  </td>
                  <td style={{ textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <span className="print-only" style={{ fontSize: '0.8rem' }}>{item.precioUnitario.toFixed(2)}</span>
                    <input type="number" value={item.precioUnitario} onChange={(e) => actualizarItem(index, 'precioUnitario', e.target.value)} className="screen-only" style={{ width: '60px', textAlign: 'center' }} />
                  </td>
                  <td style={{ textAlign: 'center', border: '1px solid #e2e8f0', fontWeight: 'bold', fontSize: '0.85rem' }}>
                    {item.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer de Pago */}
        <div style={{ padding: '0.5rem 1rem', background: '#f8fafc', borderTop: '2px solid #2d5a8c' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#1e3a5f' }}>TOTAL A PAGAR: </span>
            <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>S/ </span>
            <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#2d5a8c' }}>{totalGeneral.toFixed(2)}</span>
          </div>
          <p style={{ textAlign: 'right', fontSize: '0.65rem', color: '#64748b', fontStyle: 'italic', margin: '0 0 0.5rem 0' }}>⏰ Válido por 7 días</p>
          
          <div className="cuentas-bancarias" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem', fontSize: '0.7rem' }}>
            <div><b>BCP Soles:</b> 19138313291092</div>
            <div><b>BCP Inter:</b> 00219113831329109257</div>
            <div><b>BBVA:</b> 001106140200143068</div>
            <div><b>Yape:</b> <span style={{ fontWeight: 'bold' }}>964194540</span></div>
          </div>
        </div>

        {/* Controles Pantalla */}
        <div className="screen-only" style={{ padding: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <button onClick={agregarItem} style={{ padding: '0.5rem', fontWeight: 'bold' }}>+ Agregar</button>
          <button onClick={guardarPDF} style={{ padding: '0.5rem', background: '#059669', color: 'white', fontWeight: 'bold' }}>💾 Guardar PDF</button>
          <button onClick={nuevaCotizacion} style={{ padding: '0.5rem' }}>🔄 Nueva</button>
          <button onClick={() => { if(confirm('¿Limpiar?')) { localStorage.removeItem('historial_rodrigo'); setHistorial([]); }}} style={{ padding: '0.5rem', background: '#ef4444', color: 'white' }}>🗑️ Limpiar</button>
        </div>
      </div>

      {/* Historial Pantalla */}
      <div className="screen-only" style={{ maxWidth: '900px', margin: '1rem auto', padding: '1rem', backgroundColor: 'white' }}>
        <h3 style={{ fontSize: '0.9rem', borderBottom: '1px solid #1e3a5f' }}>📋 Historial</h3>
        <table style={{ width: '100%', fontSize: '0.8rem' }}>
          <tbody>
            {historial.map((h, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.3rem' }}>{h.proforma} - {h.cliente}</td>
                <td style={{ textAlign: 'right', fontWeight: 'bold' }}>S/ {h.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: A4; margin: 0; }
          body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .screen-only { display: none !important; }
          .contenedor-principal { width: 100% !important; max-width: none !important; margin: 0 !important; box-shadow: none !important; }
          .cuentas-bancarias { display: grid !important; grid-template-columns: repeat(2, 1fr) !important; gap: 0.2rem !important; }
        }
      `}} />
    </div>
  )
}
