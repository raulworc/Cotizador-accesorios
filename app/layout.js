import './globals.css'

export const metadata = {
  title: 'Generador de Cotizaciones - Accesorios Rodrigo',
  description: 'Sistema de cotizaciones profesional',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
      </head>
      <body>{children}</body>
    </html>
  )
}
