'use client'
import { useState, useEffect } from 'react'

export default function CotizadorProfesional() {
  const [cliente, setCliente] = useState('')
  const [items, setItems] = useState([])
  const [proforma, setProforma] = useState('000001')
  const [editandoProforma, setEditandoProforma] = useState(false)
  const [historial, setHistorial] = useState([])
  const [mostrarHistorial, setMostrarHistorial] = useState(false)
  const [logoUrl, setLogoUrl] = useState('')

  // Cargar historial al iniciar
  useEffect(() => {
    setLogoUrl('/logo.png')
    const historialGuardado = localStorage.getItem('historial_cotizaciones')
    if (historialGuardado) {
      setHistorial(JSON.parse(historialGuardado))
    }
    
    // Auto-incrementar proforma basado en historial
    const ultimaProforma = localStorage.getItem('ultima_proforma')
    if (ultimaProforma) {
      const numero = parseInt(ultimaProforma) + 1
      setProforma(String(numero).padStart(6, '0'))
    }
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
    const dia = String(hoy.getDate()).padStart(2, '0')
    const mes = String(hoy.getMonth() + 1).padStart(2, '0')
    const año = hoy.getFullYear()
    return `${dia}/${mes}/${año}`
  }

  const guardarEnHistorial = () => {
    const cotizacion = {
      id: Date.now(),
      proforma,
      cliente,
      items: [...items],
      total: totalGeneral,
      fecha: new Date().toISOString()
    }

    const nuevoHistorial = [cotizacion, ...historial].slice(0, 10)
    setHistorial(nuevoHistorial)
    localStorage.setItem('historial_cotizaciones', JSON.stringify(nuevoHistorial))
    localStorage.setItem('ultima_proforma', proforma)
  }

  const cargarCotizacion = (cotizacion) => {
    setCliente(cotizacion.cliente)
    setItems(cotizacion.items)
    setProforma(cotizacion.proforma)
    setMostrarHistorial(false)
  }

  const nuevaCotizacion = () => {
    if (items.length > 0 || cliente) {
      if (!confirm('¿Estás seguro? Se perderán los datos de la cotización actual.')) {
        return
      }
    }
    
    setCliente('')
    setItems([])
    
    // Auto-incrementar número de proforma
    const numero = parseInt(proforma) + 1
    setProforma(String(numero).padStart(6, '0'))
  }

  const imprimirPDF = () => {
    if (items.length === 0) {
      alert('Agrega al menos un producto antes de imprimir')
      return
    }
    
    guardarEnHistorial()
    window.print()
  }

  const guardarPDF = () => {
    if (items.length === 0) {
      alert('Agrega al menos un producto antes de guardar')
      return
    }
    
    if (!cliente) {
      alert('Ingresa el nombre del cliente antes de guardar')
      return
    }

    guardarEnHistorial()

    const hoy = new Date()
    const dia = String(hoy.getDate()).padStart(2, '0')
    const mes = String(hoy.getMonth() + 1).padStart(2, '0')
    const año = hoy.getFullYear()
    const hora = String(hoy.getHours()).padStart(2, '0')
    const minuto = String(hoy.getMinutes()).padStart(2, '0')
    const segundo = String(hoy.getSeconds()).padStart(2, '0')
    
    const nombreCliente = cliente.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 15) || 'Cliente'
    const nombreArchivo = `Cotizacion_${proforma}_${dia}-${mes}-${año}_${hora}-${minuto}-${segundo}_${nombreCliente}`
    
    const tituloOriginal = document.title
    document.title = nombreArchivo
    
    window.print()
    
    setTimeout(() => {
      document.title = tituloOriginal
    }, 1000)
  }

  const cambiarProforma = () => {
    setEditandoProforma(true)
  }

  const guardarProforma = (e) => {
    if (e.key === 'Enter' || e.type === 'blur') {
      setEditandoProforma(false)
      // Asegurar formato de 6 dígitos
      const numero = parseInt(proforma) || 1
      setProforma(String(numero).padStart(6, '0'))
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <div className="contenedor-principal" style={{ maxWidth: '1200px', margin: '0 auto', backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a8c 100%)', padding: '1.5rem 1rem', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
              <div className="logo-container" style={{ backgroundColor: 'white', padding: '0.5rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', minHeight: '60px', justifyContent: 'center' }}>
                {logoUrl ? (
                  <img 
                    src={logoUrl}
                    alt="Accesorios Rodrigo" 
                    style={{ width: 'auto', height: '50px', maxWidth: '180px' }}
                    onError={() => setLogoUrl('')}
                  />
                ) : (
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1e3a5f', padding: '0 1rem' }}>
                    ACCESORIOS RODRIGO
                  </div>
                )}
              </div>
              <div className="info-contacto" style={{ fontSize: '0.7rem', lineHeight: 1.4 }}>
                <p style={{ margin: '0.2rem 0', opacity: 0.95 }}>📍 C. Central Km12.5 Lt 67, Ate, Lima</p>
                <p style={{ margin: '0.2rem 0', opacity: 0.95 }}>📞 964194540 | ✉️ olga231702@gmail.com</p>
              </div>
            </div>
            
            <div className="cotizacion-header" style={{ textAlign: 'right' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, letterSpacing: '0.05em' }}>COTIZACIÓN</h2>
              <p style={{ fontSize: '0.8rem', margin: '0.2rem 0', opacity: 0.9 }}>Fecha: {formatoFecha()}</p>
              <div style={{ fontSize: '0.8rem', margin: 0, opacity: 0.9, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <span>N° de Pro-forma:</span>
                {editandoProforma ? (
                  <input
                    type="text"
                    value={proforma}
                    onChange={(e) => setProforma(e.target.value)}
                    onKeyDown={guardarProforma}
                    onBlur={guardarProforma}
                    autoFocus
                    style={{ width: '80px', padding: '0.2rem', fontSize: '0.8rem', textAlign: 'center', borderRadius: '0.25rem', border: '1px solid white' }}
                  />
                ) : (
                  <span 
                    onClick={cambiarProforma}
                    className="screen-only"
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                    title="Clic para editar"
                  >
                    {proforma}
                  </span>
                )}
                <span className="print-only">{proforma}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cliente */}
        <div style={{ padding: '1rem', backgroundColor: '#f1f5f9', borderBottom: '2px solid #e2e8f0' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#1e3a5f', marginBottom: '0.4rem' }}>CLIENTE</label>
          <div className="screen-only">
            <input
              type="text"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              placeholder="Nombre del cliente"
              style={{ width: '100%', padding: '0.6rem', fontSize: '0.9rem', fontWeight: 500, border: '2px solid #cbd5e1', borderRadius: '0.4rem', outline: 'none', backgroundColor: 'white' }}
            />
          </div>
          <div className="print-only" style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1e293b' }}>
            {cliente || 'Nombre del cliente'}
          </div>
        </div>

        {/* Tabla */}
        <div style={{ padding: '0 1rem 1rem 1rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem', tableLayout: 'fixed', border: '2px solid #e2e8f0' }}>
            <thead>
              <tr style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a8c 100%)', color: 'white' }}>
                <th className="th-numero" style={{ padding: '0.6rem 0.2rem', fontSize: '0.65rem', fontWeight: 'bold', textAlign: 'center', width: '8%' }}>#</th>
                <th className="th-descripcion" style={{ padding: '0.6rem 0.3rem', fontSize: '0.65rem', fontWeight: 'bold', textAlign: 'left', width: '42%' }}>DESCRIPCIÓN</th>
                <th className="th-cantidad" style={{ padding: '0.6rem 0.2rem', fontSize: '0.65rem', fontWeight: 'bold', textAlign: 'center', width: '15%' }}>CANT.</th>
                <th className="th-precio" style={{ padding: '0.6rem 0.2rem', fontSize: '0.65rem', fontWeight: 'bold', textAlign: 'center', width: '17%' }}>P.U.</th>
                <th className="th-total" style={{ padding: '0.6rem 0.2rem', fontSize: '0.65rem', fontWeight: 'bold', textAlign: 'center', width: '18%' }}>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '2.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem', backgroundColor: '#f8fafc' }}>
                    Agregue productos a la cotización
                  </td>
                </tr>
              ) : (
                <>
                  {items.map((item, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                      <td style={{ padding: '0.6rem 0.2rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: '#475569', border: '1px solid #e2e8f0' }}>
                        {index + 1}
                      </td>
                      
                      <td style={{ padding: '0.4rem 0.3rem', border: '1px solid #e2e8f0' }}>
                        <input
                          type="text"
                          value={item.descripcion}
                          onChange={(e) => actualizarItem(index, 'descripcion', e.target.value)}
                          className="screen-only input-tabla"
                          style={{ width: '100%', padding: '0.4rem', fontSize: '0.8rem', border: '1px solid #cbd5e1', borderRadius: '0.3rem', outline: 'none', boxSizing: 'border-box' }}
                          placeholder="Descripción del producto"
                        />
                        <span className="print-only" style={{ fontSize: '0.8rem', color: '#1e293b' }}>{item.descripcion}</span>
                      </td>
                      
                      <td style={{ padding: '0.4rem 0.2rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                        <input
                          type="number"
                          value={item.cantidad}
                          onChange={(e) => actualizarItem(index, 'cantidad', e.target.value)}
                          className="screen-only input-tabla"
                          style={{ width: '100%', padding: '0.4rem', fontSize: '0.75rem', textAlign: 'center', border: '1px solid #cbd5e1', borderRadius: '0.3rem', outline: 'none', boxSizing: 'border-box' }}
                          min="0"
                        />
                        <span className="print-only" style={{ fontSize: '0.8rem', color: '#1e293b' }}>{item.cantidad}</span>
                      </td>
                      
                      <td style={{ padding: '0.4rem 0.2rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                        <input
                          type="number"
                          value={item.precioUnitario}
                          onChange={(e) => actualizarItem(index, 'precioUnitario', e.target.value)}
                          className="screen-only input-tabla"
                          style={{ width: '100%', padding: '0.4rem', fontSize: '0.75rem', textAlign: 'center', border: '1px solid #cbd5e1', borderRadius: '0.3rem', outline: 'none', boxSizing: 'border-box' }}
                          min="0"
                          step="0.01"
                        />
                        <span className="print-only" style={{ fontSize: '0.8rem', color: '#1e293b' }}>{item.precioUnitario.toFixed(2)}</span>
                      </td>
                      
                      <td style={{ padding: '0.4rem 0.2rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', gap: '0.2rem', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#2d5a8c' }}>
                            {item.total.toFixed(2)}
                          </span>
                          <button
                            onClick={() => eliminarItem(index)}
                            className="screen-only"
                            style={{ padding: '0.1rem', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', lineHeight: 1 }}
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  
                  {items.length < 8 && (
                    [...Array(8 - items.length)].map((_, i) => (
                      <tr key={`empty-${i}`} style={{ backgroundColor: (items.length + i) % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                        <td style={{ padding: '0.9rem 0.2rem', border: '1px solid #e2e8f0' }}>&nbsp;</td>
                        <td style={{ padding: '0.9rem 0.3rem', border: '1px solid #e2e8f0' }}>&nbsp;</td>
                        <td style={{ padding: '0.9rem 0.2rem', border: '1px solid #e2e8f0' }}>&nbsp;</td>
                        <td style={{ padding: '0.9rem 0.2rem', border: '1px solid #e2e8f0' }}>&nbsp;</td>
                        <td style={{ padding: '0.9rem 0.2rem', border: '1px solid #e2e8f0' }}>&nbsp;</td>
                      </tr>
                    ))
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* Total + Validez */}
        <div className="seccion-total" style={{ padding: '0.8rem 1rem', background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)', borderTop: '3px solid #2d5a8c' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <span className="texto-total" style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#1e3a5f' }}>TOTAL A PAGAR</span>
            <span className="monto-total" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2d5a8c' }}>S/ {totalGeneral.toFixed(2)}</span>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.7rem', color: '#64748b', marginTop: '0.3rem' }}>
            ⏰ Válido por 7 días
          </div>
        </div>

        {/* Descuentos Info */}
        <div style={{ padding: '0.6rem 1rem', backgroundColor: '#eff6ff', borderTop: '1px solid #bfdbfe', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', color: '#1e3a5f', margin: 0, fontWeight: 500 }}>
            💰 Descuentos por compras mayores a 10 unidades
          </p>
        </div>

        {/* Información Bancaria */}
        <div className="info-bancaria" style={{ padding: '1rem', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#1e3a5f', marginBottom: '0.6rem', textAlign: 'center' }}>INFORMACIÓN BANCARIA</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.6rem' }}>
            <div style={{ padding: '0.5rem', backgroundColor: 'white', borderRadius: '0.3rem', border: '1px solid #e2e8f0' }}>
              <p style={{ fontSize: '0.65rem', color: '#64748b', margin: 0 }}>BCP Soles</p>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e293b', margin: '0.15rem 0 0 0' }}>19138313291092</p>
            </div>
            <div style={{ padding: '0.5rem', backgroundColor: 'white', borderRadius: '0.3rem', border: '1px solid #e2e8f0' }}>
              <p style={{ fontSize: '0.65rem', color: '#64748b', margin: 0 }}>BCP Interbancario</p>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e293b', margin: '0.15rem 0 0 0' }}>002-19113831329109257</p>
            </div>
            <div style={{ padding: '0.5rem', backgroundColor: 'white', borderRadius: '0.3rem', border: '1px solid #e2e8f0' }}>
              <p style={{ fontSize: '0.65rem', color: '#64748b', margin: 0 }}>BBVA</p>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e293b', margin: '0.15rem 0 0 0' }}>0011-0614-0200143068</p>
            </div>
            <div style={{ padding: '0.5rem', backgroundColor: 'white', borderRadius: '0.3rem', border: '1px solid #e2e8f0' }}>
              <p style={{ fontSize: '0.65rem', color: '#64748b', margin: 0 }}>Yape</p>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e293b', margin: '0.15rem 0 0 0' }}>964194540</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '0.8rem', background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a8c 100%)', textAlign: 'center' }}>
          <p style={{ color: 'white', fontWeight: 600, fontSize: '0.85rem', margin: 0, letterSpacing: '0.03em' }}>¡Gracias por su Preferencia!</p>
        </div>

        {/* Controles */}
        <div className="screen-only controles-container" style={{ padding: '1rem', backgroundColor: '#f1f5f9', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.6rem', maxWidth: '700px', margin: '0 auto' }}>
            
            {/* Botón Historial */}
            <button
              onClick={() => setMostrarHistorial(!mostrarHistorial)}
              className="screen-only-desktop"
              style={{ padding: '0.7rem', backgroundColor: '#8b5cf6', color: 'white', border: 'none', borderRadius: '0.4rem', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
            >
              📋 {mostrarHistorial ? 'Ocultar Historial' : `Ver Historial (${historial.length})`}
            </button>

            {/* Panel de Historial */}
            {mostrarHistorial && historial.length > 0 && (
              <div style={{ backgroundColor: 'white', border: '2px solid #8b5cf6', borderRadius: '0.4rem', padding: '1rem', maxHeight: '300px', overflowY: 'auto' }}>
                <h4 style={{ margin: '0 0 0.75rem 0', color: '#1e3a5f', fontSize: '0.9rem' }}>Últimas Cotizaciones</h4>
                {historial.map((cot) => (
                  <div 
                    key={cot.id}
                    onClick={() => cargarCotizacion(cot)}
                    style={{ 
                      padding: '0.6rem', 
                      marginBottom: '0.5rem', 
                      backgroundColor: '#f8fafc', 
                      borderRadius: '0.3rem', 
                      cursor: 'pointer',
                      border: '1px solid #e2e8f0',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                      <span style={{ fontWeight: 600, color: '#1e3a5f' }}>#{cot.proforma} - {cot.cliente || 'Sin cliente'}</span>
                      <span style={{ color: '#64748b' }}>{new Date(cot.fecha).toLocaleDateString()}</span>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.25rem' }}>
                      {cot.items.length} productos - S/ {cot.total.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={agregarItem}
              style={{ padding: '0.7rem', backgroundColor: 'white', color: '#2d5a8c', border: '2px solid #2d5a8c', borderRadius: '0.4rem', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}
            >
              + Agregar producto
            </button>
            
            <div className="screen-only-desktop" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.6rem' }}>
              <button
                onClick={imprimirPDF}
                style={{ padding: '0.7rem', background: 'linear-gradient(135deg, #2d5a8c 0%, #1e3a5f 100%)', color: 'white', border: 'none', borderRadius: '0.4rem', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
              >
                🖨️ Imprimir
              </button>

              <button
                onClick={guardarPDF}
                style={{ padding: '0.7rem', background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', color: 'white', border: 'none', borderRadius: '0.4rem', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
              >
                💾 Guardar PDF
              </button>
              
              <button
                onClick={nuevaCotizacion}
                style={{ padding: '0.7rem', backgroundColor: '#64748b', color: 'white', border: 'none', borderRadius: '0.4rem', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
              >
                🔄 Nueva
              </button>
            </div>

            <button
              onClick={nuevaCotizacion}
              className="screen-only-mobile"
              style={{ padding: '0.7rem', backgroundColor: '#64748b', color: 'white', border: 'none', borderRadius: '0.4rem', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}
            >
              Nueva Cotización
            </button>
            
            <p className="screen-only-mobile" style={{ textAlign: 'center', fontSize: '0.65rem', color: '#64748b', margin: '0.3rem 0 0 0' }}>
              📸 Presiona Compartir → Crear archivo PDF
            </p>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .input-tabla:focus {
          border-color: #2d5a8c !important;
          box-shadow: 0 0 0 2px rgba(45, 90, 140, 0.1);
        }

        @media (max-width: 768px) {
          .screen-only-desktop {
            display: none !important;
          }
          .screen-only-mobile {
            display: block !important;
          }
          .logo-container {
            padding: 0.3rem !important;
            min-height: 45px !important;
          }
          .logo-container img {
            height: 35px !important;
          }
          .info-contacto {
            display: none !important;
          }
          .cotizacion-header h2 {
            font-size: 1.25rem !important;
          }
          .th-numero, .th-cantidad, .th-precio, .th-total {
            font-size: 0.6rem !important;
            padding: 0.5rem 0.15rem !important;
          }
          .th-descripcion {
            font-size: 0.6rem !important;
            padding: 0.5rem 0.2rem !important;
          }
          .seccion-total {
            padding: 0.6rem 1rem !important;
          }
          .texto-total {
            font-size: 0.75rem !important;
          }
          .monto-total {
            font-size: 1.25rem !important;
          }
          .info-bancaria {
            display: none !important;
          }
        }

        @media (min-

        @media (min-width: 769px) {
          .screen-only-desktop {
            display: block !important;
          }
          .screen-only-mobile {
            display: none !important;
          }
        }

        @media screen {
          .print-only {
            display: none !important;
          }
        }
        /* ===== MODO PDF ===== */
body.pdf-mode .screen-only,
body.pdf-mode .screen-only-desktop,
body.pdf-mode .screen-only-mobile,
body.pdf-mode #acciones {
  display: none !important;
}

body.pdf-mode .print-only {
  display: block !important;
}

body.pdf-mode input {
  border: none !important;
  background: transparent !important;
}

/* Proporción A4 en pantalla SOLO cuando se genera el PDF */
body.pdf-mode #cotizacion-pdf {
  min-height: 520px;   /* da cuerpo al documento sin usar filas falsas */
}


        @media print {
          @page {
            margin: 1cm;
          }
          
          body { 
            margin: 0; 
            padding: 0;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .screen-only, .screen-only-desktop, .screen-only-mobile, .controles-container {
            display: none !important;
          }
          
          .print-only {
            display: block !important;
          }

          .info-bancaria {
            display: block !important;
            page-break-inside: avoid;
          }
          
          .contenedor-principal {
            box-shadow: none !important;
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

