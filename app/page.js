'use client'
import { useState } from 'react'

export default function Cotizador() {
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
        <div style={{ backgroundColor: 'white', padding: '1rem', borderBottom: '4px solid #dc2626' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: '1rem', fontWeight: 'bold', margin: 0 }}>ACCESORIOS RODRIGO</h1>
              <p style={{ fontSize: '0.75rem', margin: '0.25rem 0' }}>C. Central Km12.5 Lt 67 Sector Pacayal</p>
              <p style={{ fontSize: '0.75rem', margin: 0 }}>Ate, Lima, Perú</p>
              <p style={{ fontSize: '0.75rem', margin: '0.25rem 0' }}>📞 964194540</p>
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#dc2626', margin: 0 }}>COTIZACIÓN</h2>
              <p style={{ fontSize: '0.75rem', margin: '0.25rem 0' }}>Fecha: {formatoFecha()}</p>
              <p style={{ fontSize: '0.75rem', margin: 0 }}>N° {proforma}</p>
            </div>
          </div>
        </div>

        {/* Cliente */}
        <div style={{ padding: '0.5rem 1rem', backgroundColor: '#f9fafb' }}>
          <input
            type="text"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            placeholder="Nombre del cliente"
            style={{ width: '100%', padding: '0.5rem', fontSize: '0.875rem', border: '1px solid #d1d5db', borderRadius: '0.25rem' }}
          />
        </div>

        {/* Tabla */}
        <div style={{ padding: '0.5rem 1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '30px 1fr 60px 70px 80px', gap: '0.25rem', padding: '0.5rem', backgroundColor: '#dc2626', color: 'white', fontSize: '0.75rem', fontWeight: 'bold', borderRadius: '0.25rem 0.25rem 0 0' }}>
            <div style={{ textAlign: 'center' }}>#</div>
            <div>DESCRIPCIÓN</div>
            <div style={{ textAlign: 'center' }}>CANT</div>
            <div style={{ textAlign: 'center' }}>P.U.</div>
            <div style={{ textAlign: 'center' }}>TOTAL</div>
          </div>
          
          <div style={{ border: '1px solid #d1d5db', borderTop: 'none' }}>
            {items.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af', fontSize: '0.875rem', borderBottom: '1px solid #d1d5db' }}>
                Sin productos
              </div>
            ) : (
              items.map((item, index) => (
                <div key={index} style={{ display: 'grid', gridTemplateColumns: '30px 1fr 60px 70px 80px', gap: '0.25rem', padding: '0.25rem', borderBottom: '1px solid #e5e7eb', alignItems: 'center' }}>
                  <div style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 600 }}>
                    {index + 1}
                  </div>
                  
                  <input
                    type="text"
                    value={item.descripcion}
                    onChange={(e) => actualizarItem(index, 'descripcion', e.target.value)}
                    style={{ width: '100%', padding: '0.25rem', fontSize: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.25rem' }}
                    placeholder="Producto"
                  />
                  
                  <input
                    type="number"
                    value={item.cantidad}
                    onChange={(e) => actualizarItem(index, 'cantidad', e.target.value)}
                    style={{ width: '100%', padding: '0.25rem', fontSize: '0.75rem', textAlign: 'center', border: '1px solid #d1d5db', borderRadius: '0.25rem' }}
                    min="0"
                  />
                  
                  <input
                    type="number"
                    value={item.precioUnitario}
                    onChange={(e) => actualizarItem(index, 'precioUnitario', e.target.value)}
                    style={{ width: '100%', padding: '0.25rem', fontSize: '0.75rem', textAlign: 'center', border: '1px solid #d1d5db', borderRadius: '0.25rem' }}
                    min="0"
                    step="0.01"
                  />
                  
                  <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                    <div style={{ flex: 1, padding: '0.25rem', fontSize: '0.75rem', textAlign: 'center', backgroundColor: '#fee2e2', border: '1px solid #fecaca', borderRadius: '0.25rem', fontWeight: 'bold', color: '#dc2626' }}>
                      {item.total.toFixed(2)}
                    </div>
                    <button
                      onClick={() => eliminarItem(index)}
                      style={{ padding: '0.25rem', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
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
                  <div key={`empty-${i}`} style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6' }}>
                    &nbsp;
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Total */}
        <div style={{ padding: '1rem', backgroundColor: '#1f2937', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'white' }}>TOTAL A PAGAR</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444' }}>S/ {totalGeneral.toFixed(2)}</span>
        </div>

        {/* Footer */}
        <div style={{ padding: '0.75rem', backgroundColor: '#dc2626', textAlign: 'center' }}>
          <p style={{ color: 'white', fontWeight: 600, fontSize: '0.75rem', margin: 0 }}>¡Gracias por su Preferencia!</p>
        </div>

        {/* Controles */}
        <div style={{ padding: '0.75rem', backgroundColor: '#f3f4f6' }}>
          <button
            onClick={agregarItem}
            style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', backgroundColor: 'white', border: '1px solid #d1d5db', borderRadius: '0.25rem', fontSize: '0.875rem', cursor: 'pointer' }}
          >
            + Agregar producto
          </button>
          
          <button
            onClick={nuevaCotizacion}
            style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1f2937', color: 'white', border: 'none', borderRadius: '0.25rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
          >
            NUEVA COTIZACIÓN
          </button>
        </div>
      </div>
    </div>
  )
}
