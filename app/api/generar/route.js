import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { descripcion } = await request.json()

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'system',
          content: `Eres un asistente que genera cotizaciones. Catálogo base:
- Sujetador: S/ 12
- Malacate: S/ 46

INSTRUCCIONES:
- Si mencionan un producto del catálogo SIN especificar precio, usa el precio del catálogo
- Si especifican un precio diferente, usa ese precio
- Si mencionan un producto NUEVO, incluye el precio que especifiquen
- Si mencionan "para [nombre]", extrae el nombre del cliente

Responde SOLO con JSON válido:
{
  "cliente": "Juan Pérez o null",
  "items": [
    {"descripcion": "Sujetador", "cantidad": 5, "precio": 12}
  ]
}`
        }, {
          role: 'user',
          content: descripcion
        }],
        temperature: 0.7
      })
    })

    const data = await response.json()
    const resultado = JSON.parse(data.choices[0].message.content)
    return NextResponse.json(resultado)

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error al generar cotización' }, { status: 500 })
  }
}
