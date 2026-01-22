'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Download } from 'lucide-react';

export default function InvoiceGenerator() {
  const [formData, setFormData] = useState({
    clientName: '',
    clientAddress: '',
    clientPhone: '',
    clientEmail: '',
    proformaNumber: '000001',
    date: new Date().toISOString().split('T')[0],
    validDays: '7'
  });

  const [items, setItems] = useState([]);

  const addItem = () => {
    setItems([...items, { description: '', quantity: '', price: '' }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      return sum + (parseFloat(item.quantity || 0) * parseFloat(item.price || 0));
    }, 0);
  };

  const downloadPDF = async () => {
    const element = document.getElementById('invoice-content');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const clientName = formData.clientName.replace(/\s+/g, '_').slice(0, 20) || 'cliente';
    const filename = `factura_${clientName}_${timestamp}.pdf`;
    
    const opt = {
      margin: 10,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: false,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };
    
    try {
      const worker = html2pdf().set(opt).from(element);
      const pdf = await worker.outputPdf('arraybuffer');
      
      const blob = new Blob([pdf], { type: 'application/pdf' });
      
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, filename);
      } else {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 250);
      }
      
    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('Error al generar el PDF. Por favor intenta de nuevo.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
      
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #invoice-content, #invoice-content * {
            visibility: visible;
          }
          #invoice-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
        
        @media screen and (min-width: 768px) {
          .desktop-layout {
            display: flex;
            gap: 2rem;
          }
          .desktop-form {
            flex: 1;
            max-width: 500px;
          }
          .desktop-preview {
            flex: 1;
            position: sticky;
            top: 2rem;
            height: fit-content;
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Generador de Cotizaciones</h1>
        
        <div className="desktop-layout">
          {/* Formulario */}
          <div className="desktop-form bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Información del Cliente</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del cliente
                </label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección
                </label>
                <input
                  type="text"
                  value={formData.clientAddress}
                  onChange={(e) => setFormData({...formData, clientAddress: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="text"
                  value={formData.clientPhone}
                  onChange={(e) => setFormData({...formData, clientPhone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) => setFormData({...formData, clientEmail: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    N° Pro-forma
                  </label>
                  <input
                    type="text"
                    value={formData.proformaNumber}
                    onChange={(e) => setFormData({...formData, proformaNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Válido por (días)
                </label>
                <input
                  type="number"
                  value={formData.validDays}
                  onChange={(e) => setFormData({...formData, validDays: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <h2 className="text-xl font-semibold mt-6 mb-4">Productos/Servicios</h2>
            
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <input
                    type="text"
                    placeholder="Descripción"
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Cant."
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Precio"
                    value={item.price}
                    onChange={(e) => updateItem(index, 'price', e.target.value)}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => removeItem(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={addItem}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Agregar producto
            </button>

            <button
              onClick={downloadPDF}
              className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-semibold"
            >
              <Download size={20} />
              Guardar como PDF
            </button>
          </div>

          {/* Vista Previa */}
          <div className="desktop-preview">
            <div id="invoice-content" className="bg-white rounded-lg shadow-md p-8">
              {/* Encabezado */}
              <div className="flex justify-between items-start mb-8">
                <div className="bg-blue-900 text-white px-6 py-3 rounded">
                  <h2 className="text-xl font-bold">ACCESORIOS</h2>
                  <h2 className="text-xl font-bold">RODRIGO</h2>
                </div>
                <div className="text-right">
                  <h1 className="text-2xl font-bold text-blue-900 mb-2">COTIZACIÓN</h1>
                  <p className="text-sm text-gray-600">Fecha: {formData.date.split('-').reverse().join('/')}</p>
                  <p className="text-sm text-gray-600">N° de Pro-forma: {formData.proformaNumber}</p>
                </div>
              </div>

              {/* Información del Cliente */}
              <div className="mb-6 p-4 bg-gray-50 rounded">
                <h3 className="font-semibold text-gray-700 mb-2">CLIENTE</h3>
                <p className="font-semibold">{formData.clientName || 'Nombre del cliente'}</p>
                {formData.clientAddress && <p className="text-sm text-gray-600">{formData.clientAddress}</p>}
                {formData.clientPhone && <p className="text-sm text-gray-600">Tel: {formData.clientPhone}</p>}
                {formData.clientEmail && <p className="text-sm text-gray-600">{formData.clientEmail}</p>}
              </div>

              {/* Tabla de productos */}
              <table className="w-full mb-6">
                <thead>
                  <tr className="bg-blue-900 text-white">
                    <th className="text-left p-2 text-sm">#</th>
                    <th className="text-left p-2 text-sm">DESCRIPCIÓN</th>
                    <th className="text-center p-2 text-sm">CANT.</th>
                    <th className="text-right p-2 text-sm">P.U.</th>
                    <th className="text-right p-2 text-sm">TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-gray-400">
                        Agregue productos a la cotización
                      </td>
                    </tr>
                  ) : (
                    items.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2 text-sm">{index + 1}</td>
                        <td className="p-2 text-sm">{item.description}</td>
                        <td className="p-2 text-sm text-center">{item.quantity}</td>
                        <td className="p-2 text-sm text-right">S/ {parseFloat(item.price || 0).toFixed(2)}</td>
                        <td className="p-2 text-sm text-right">
                          S/ {(parseFloat(item.quantity || 0) * parseFloat(item.price || 0)).toFixed(2)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Total */}
              <div className="flex justify-end mb-6">
                <div className="w-64 bg-blue-900 text-white p-4 rounded">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">TOTAL A PAGAR</span>
                    <span className="text-xl font-bold">S/ {calculateTotal().toFixed(2)}</span>
                  </div>
                  <p className="text-xs mt-2 text-blue-200">⏱️ Válido por {formData.validDays} días</p>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-6">
                <p className="text-sm text-yellow-800">
                  🔥 Descuentos por compras mayores a 10 unidades
                </p>
              </div>

              {/* Información Bancaria */}
              <div className="bg-gray-50 p-4 rounded mb-6">
                <h3 className="font-semibold text-gray-700 mb-3">INFORMACIÓN BANCARIA</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-semibold text-gray-600">BCP Soles</p>
                    <p className="text-gray-700">19138313291092</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600">BCP Interbancario</p>
                    <p className="text-gray-700">002-19138313291092757</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600">BBVA</p>
                    <p className="text-gray-700">0011-0614-0200143068</p>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="font-semibold text-gray-600">Yape</p>
                  <p className="text-gray-700">964194540</p>
                </div>
              </div>

              {/* Pie de página */}
              <div className="text-center bg-blue-900 text-white py-3 rounded">
                <p className="font-semibold">¡Gracias por su Preferencia!</p>
              </div>

              <div className="text-center text-xs text-gray-500 mt-4">
                <p>https://cotizacion-accesorios.vercel.app</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
