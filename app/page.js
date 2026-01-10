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
        
        {/* Header */}
        <div style={{ backgroundColor: 'white', padding: '1rem 0.75rem', borderBottom: '3px solid #dc2626' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div style={{ display: 'flex', gap: '0.5rem', flex: 1, alignItems: 'start' }}>
              <div style={{ backgroundColor: '#dc2626', padding: '0.5rem', borderRadius: '0.25rem', flexShrink: 0 }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <rect x="1" y="3" width="15" height="13"></rect>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                  <circle cx="5.5" cy="18.5" r="2.5"></circle>
                  <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h1 style={{ fontSize: '1.125rem', fontWeight: 'bold', margin: 0, lineHeight: 1.3 }}>ACCESORIOS RODRIGO</h1>
                <p style={{ fontSize: '0.75rem', margin: '0.25rem 0', lineHeight: 1.3, color: '#374151' }}>C. Central Km12.5 Lt 67 Sector Pacayal</p>
                <p style={{ fontSize: '0.75rem', margin: 0, lineHeight: 1.3, color: '#374151' }}>Ate, Lima, Perú</p>
                <p style={{ fontSize: '0.75rem', margin: '0.25rem 0', color: '#dc2626', fontWeight: 500 }}>📞 964194540 | ✉️ olga231702@gmail.com</p>
              </div>
            </div>
            
            <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '1rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc2626', margin: 0, lineHeight: 1.2 }}>COTIZACIÓN</h2>
              <p style={{ fontSize: '0.75rem', margin: '0.25rem 0', color: '#374151' }}>Fecha: {formatoFecha()}</p>
              <p style={{ fontSize: '0.75rem', margin: 0, color: '#374151' }}>N° de Pro-forma: {proforma}</p>
            </div>
          </div>
        </div>

        {/* Cliente - En pantalla input, al imprimir texto */}
        <div style={{ padding: '0.75rem', backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
          <div className="screen-only">
            <input
              type="text"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              placeholder="Nombre del cliente"
              style={{ width: '100%', padding: '0.5rem', fontSize: '0.875rem', fontWeight: 600, border: '1px solid #d1d5db', borderRadius: '0.25rem', outline: 'none' }}
            />
          </div>
          <div className="print-only" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>
            {cliente || 'Nombre del cliente'}
          </div>
        </div>

        {/* Tabla */}
        <div style={{ padding: '0 0.75rem' }}>
          {/* Headers */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#dc2626', color: 'white' }}>
                <th style={{ padding: '0.5rem', fontSize: '0.75rem', fontWeight: 'bold', textAlign: 'center', width: '40px' }}>#</th>
                <th style={{ padding: '0.5rem', fontSize: '0.75rem', fontWeight: 'bold', textAlign: 'left' }}>DESCRIPCIÓN</th>
                <th style={{ padding: '0.5rem', fontSize: '0.75rem', fontWeight: 'bold', textAlign: 'center', width: '80px' }}>CANT.</th>
                <th style={{ padding: '0.5rem', fontSize: '0.75rem', fontWeight: 'bold', textAlign: 'center', width: '100px' }}>P. UNITARIO</th>
                <th style={{ padding: '0.5rem', fontSize: '0.75rem', fontWeight: 'bold', textAlign: 'center', width: '100px' }}>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af', fontSize: '0.875rem', border: '1px solid #e5e7eb' }}>
                    Sin productos
                  </td>
                </tr>
              ) : (
                <>
                  {items.map((item, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.5rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', border: '1px solid #e5e7eb' }}>
                        {index + 1}
                      </td>
                      
                      <td style={{ padding: '0.5rem', border: '1px solid #e5e7eb' }}>
                        <input
                          type="text"
                          value={item.descripcion}
                          onChange={(e) => actualizarItem(index, 'descripcion', e.target.value)}
                          className="screen-only"
                          style={{ width: '100%', padding: '0.25rem', fontSize: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', outline: 'none' }}
                          placeholder="Producto"
                        />
                        <span className="print-only" style={{ fontSize: '0.75rem' }}>{item.descripcion}</span>
                      </td>
                      
                      <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #e5e7eb' }}>
                        <input
                          type="number"
                          value={item.cantidad}
                          onChange={(e) => actualizarItem(index, 'cantidad', e.target.value)}
                          className="screen-only"
                          style={{ width: '100%', padding: '0.25rem', fontSize: '0.75rem', textAlign: 'center', border: '1px solid #d1d5db', borderRadius: '0.25rem', outline: 'none' }}
                          min="0"
                        />
                        <span className="print-only" style={{ fontSize: '0.75rem' }}>{item.cantidad}</span>
                      </td>
                      
                      <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #e5e7eb' }}>
                        <input
                          type="number"
                          value={item.precioUnitario}
                          onChange={(e) => actualizarItem(index, 'precioUnitario', e.target.value)}
                          className="screen-only"
                          style={{ width: '100%', padding: '0.25rem', fontSize: '0.75rem', textAlign: 'center', border: '1px solid #d1d5db', borderRadius: '0.25rem', outline: 'none' }}
                          min="0"
                          step="0.01"
                        />
                        <span className="print-only" style={{ fontSize: '0.75rem' }}>{item.precioUnitario.toFixed(2)}</span>
                      </td>
                      
                      <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #e5e7eb' }}>
                        <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#dc2626' }}>
                            {item.total.toFixed(2)}
                          </span>
                          <button
                            onClick={() => eliminarItem(index)}
                            className="screen-only"
                            style={{ padding: '0.125rem 0.25rem', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', lineHeight: 1 }}
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  
                  {items.length < 8 && (
                    [...Array(8 - items.length)].map((_, i) => (
                      <tr key={`empty-${i}`}>
                        <td style={{ padding: '1rem', border: '1px solid #e5e7eb' }}>&nbsp;</td>
                        <td style={{ padding: '1rem', border: '1px solid #e5e7eb' }}>&nbsp;</td>
                        <td style={{ padding: '1rem', border: '1px solid #e5e7eb' }}>&nbsp;</td>
                        <td style={{ padding: '1rem', border: '1px solid #e5e7eb' }}>&nbsp;</td>
                        <td style={{ padding: '1rem', border: '1px solid #e5e7eb' }}>&nbsp;</td>
                      </tr>
                    ))
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div style={{ padding: '1rem 0.75rem', marginTop: '1rem', borderTop: '2px solid #374151' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '2rem' }}>
            <span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#111827' }}>Total a pagar</span>
            <span style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#dc2626' }}>S/ {totalGeneral.toFixed(2)}</span>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '1rem', backgroundColor: '#dc2626', textAlign: 'center', marginTop: '1rem' }}>
          <p style={{ color: 'white', fontWeight: 600, fontSize: '0.875rem', margin: 0 }}>¡Gracias por su Preferencia!</p>
        </div>

        {/* Controles - Solo en pantalla */}
        <div className="screen-only" style={{ padding: '0.75rem', backgroundColor: '#f3f4f6' }}>
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
            📸 Presiona Ctrl+P para imprimir o guardar como PDF
          </p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media screen {
          .print-only {
            display: none !important;
          }
        }
        
        @media print {
          @page {
            margin: 0.5cm;
          }
          
          body { 
            margin: 0; 
            padding: 0;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .screen-only {
            display: none !important;
          }
          
          .print-only {
            display: block !important;
          }
          
          input {
            border: none !important;
            background: transparent !important;
          }
          
          button {
            display: none !important;
          }
        }
        
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          opacity: 1;
        }
      `}} />
    </div>
  )
}
