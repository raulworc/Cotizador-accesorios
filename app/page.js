'use client'
import { useState } from 'react'

export default function CotizadorProfesional() {
  const [cliente, setCliente] = useState('')
  const [items, setItems] = useState([])
  const [proforma, setProforma] = useState('000001')

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
    const dia = String(hoy.getDate()).padStart(2, '0')
    const mes = String(hoy.getMonth() + 1).padStart(2, '0')
    const año = hoy.getFullYear()
    return `${dia}/${mes}/${año}`
  }

  const nuevaCotizacion = () => {
    setCliente('')
    setItems([])
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white' }}>
      <div style={{ maxWidth: '100%', margin: '0 auto', backgroundColor: 'white' }}>
        
        <div style={{ backgroundColor: 'white', padding: '0.75rem', borderBottom: '4px solid #dc2626' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div style={{ display: 'flex', gap: '0.5rem', flex: 1, alignItems: 'start' }}>
              <div style={{ backgroundColor: '#dc2626', padding: '0.375rem', borderRadius: '0.25rem', flexShrink: 0 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <rect x="1" y="3" width="15" height="13"></rect>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                  <circle cx="5.5" cy="18.5" r="2.5"></circle>
                  <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h1 style={{ fontSize: '0.875rem', fontWeight: 'bold', margin: 0, lineHeight: 1.2 }}>ACCESORIOS RODRIGO</h1>
                <p style={{ fontSize: '0.625rem', margin: '0.125rem 0', lineHeight: 1.2, color: '#4b5563' }}>C. Central Km12.5 Lt 67 Sector Pacayal</p>
                <p style={{ fontSize: '0.625rem', margin: 0, lineHeight: 1.2, color: '#4b5563' }}>Ate, Lima, Perú</p>
                <p style={{ fontSize: '0.625rem', margin: '0.125rem 0', color: '#1f2937' }}>📞 964194540</p>
              </div>
            </div>
            
            <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '0.5rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#dc2626', margin: 0, lineHeight: 1.2 }}>COTIZACIÓN</h2>
              <p style={{ fontSize: '0.625rem', margin: '0.125rem 0', color: '#4b5563' }}>Fecha: {formatoFecha()}</p>
              <p style={{ fontSize: '0.625rem', margin: 0, color: '#4b5563' }}>N° {proforma}</p>
            </div>
          </div>
        </div>

        <div style={{ padding: '0.5rem 0.75rem', backgroundColor: '#f9fafb' }}>
          <input
            type="text"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            placeholder="Nombre del cliente"
            style={{ width: '100%', padding: '0.5rem', fontSize: '0.875rem', fontWeight: 600, border: '1px solid #d1d5db', borderRadius: '0.25rem', outline: 'none' }}
          />
        </div>

        <div style={{ padding: '0.5rem 0.75rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '30px 1fr 60px 70px 80px', gap: '0.25rem', padding: '0.5rem 0.25rem', backgroundColor: '#dc2626', color: 'white', fontSize: '0.625rem', fontWeight: 'bold', borderRadius: '0.25rem 0.25rem 0 0' }}>
            <div style={{ textAlign: 'center' }}>#</div>
            <div>DESCRIPCIÓN</div>
            <div style={{ textAlign: 'center' }}>CANT</div>
            <div style={{ textAlign: 'center' }}>P.U.</div>
            <div style={{ textAlign: 'center' }}>TOTAL</div>
          </div>
          
          <div style={{ border: '1px solid #d1d5db', borderTop: 'none' }}>
            {items.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af', fontSize: '0.75rem', borderBottom: '1px solid #d1d5db' }}>
                Sin productos
              </div>
            ) : (
              items.map((item, index) => (
                <div key={index} style={{ display: 'grid', gridTemplateColumns: '30px 1fr 60px 70px 80px', gap: '0.25rem', padding: '0.375rem 0.25rem', borderBottom: '1px solid #e5e7eb', alignItems: 'center', backgroundColor: 'white' }}>
                  <div style={{ textAlign: 'center', fontSize: '0.625rem', fontWeight: 600, color: '#6b7280' }}>
                    {index + 1}
                  </div>
                  
                  <input
                    type="text"
                    value={item.descripcion}
                    onChange={(e) => actualizarItem(index, 'descripcion', e.target.value)}
                    style={{ width: '100%', padding: '0.25rem', fontSize: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', outline: 'none' }}
                    placeholder="Producto"
                  />
                  
                  <input
                    type="number"
                    value={item.cantidad}
                    onChange={(e) => actualizarItem(index, 'cantidad', e.target.value)}
                    style={{ width: '100%', padding: '0.25rem', fontSize: '0.75rem', textAlign: 'center', border: '1px solid #d1d5db', borderRadius: '0.25rem', outline: 'none' }}
                    min="0"
                  />
                  
                  <input
                    type="number"
                    value={item.precioUnitario}
                    onChange={(e) => actualizarItem(index, 'precioUnitario', e.target.value)}
                    style={{ width: '100%', padding: '0.25rem', fontSize: '0.75rem', textAlign: 'center', border: '1px solid #d1d5db', borderRadius: '0.25rem', outline: 'none' }}
                    min="0"
                    step="0.01"
                  />
                  
                  <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                    <div style={{ flex: 1, padding: '0.25rem', fontSize: '0.75rem', textAlign: 'center', backgroundColor: '#fee2e2', border: '1px solid #fecaca', borderRadius: '0.25rem', fontWeight: 'bold', color: '#dc2626' }}>
                      {item.total.toFixed(2)}
                    </div>
                    <button
                      onClick={() => eliminarItem(index)}
                      style={{ padding: '0.125rem', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', lineHeight: 1 }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
            
            {items.length > 0 && items.length < 8 && (
              <>
                {[...Array(8 - items.length)].map((_, i) => (
                  <div key={`empty-${i}`} style={{ padding: '0.875rem', borderBottom: '1px solid #f3f4f6', backgroundColor: 'white' }}>
                    &nbsp;
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        <div style={{ padding: '0.75rem', backgroundColor: '#1f2937', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'white' }}>TOTAL A PAGAR</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444' }}>S/ {totalGeneral.toFixed(2)}</span>
        </div>

        <div style={{ padding: '0.75rem', backgroundColor: '#dc2626', textAlign: 'center' }}>
          <p style={{ color: 'white', fontWeight: 600, fontSize: '0.75rem', margin: 0 }}>¡Gracias por su Preferencia!</p>
        </div>

        <div style={{ padding: '0.75rem', backgroundColor: '#f3f4f6' }}>
          <button
            onClick={agregarItem}
            style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', backgroundColor: 'white', border: '1px solid #d1d5db', borderRadius: '0.25rem', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 500 }}
          >
            + Agregar producto
          </button>
          
          <button
            onClick={nuevaCotizacion}
            style={{ width: '100%', padding: '0.625rem', backgroundColor: '#1f2937', color: 'white', border: 'none', borderRadius: '0.25rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
          >
            NUEVA COTIZACIÓN
          </button>
          
          <p style={{ textAlign: 'center', fontSize: '0.625rem', color: '#6b7280', margin: '0.5rem 0 0 0' }}>
            📸 Captura desde el logo hasta "¡Gracias por su Preferencia!"
          </p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          opacity: 1;
        }
        
        @media print {
          body { 
            margin: 0; 
            padding: 0; 
          }
          button {
            display: none !important;
          }
          div[style*="backgroundColor: '#f3f4f6'"] {
            display: none !important;
          }
        }
      `}} />
    </div>
  )
}
