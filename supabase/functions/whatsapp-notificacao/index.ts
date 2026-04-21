import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  try {
    const { record } = await req.json()
    if (record.estado !== 'pronto') return new Response("Ignorado", { status: 200 })

    const telefone = record.telefone; 
    const nome = record.nome_cliente || "Cliente";
    const WHATSAPP_TOKEN = Deno.env.get("WHATSAPP_TOKEN")
    const PHONE_NUMBER_ID = Deno.env.get("WHATSAPP_PHONE_ID")

    const payload = {
      messaging_product: "whatsapp",
      to: telefone,
      type: "text",
      text: { body: `Olá ${nome}! O seu pedido na Portugal Vision já está pronto! 🍳` }
    }

    await fetch(`https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${WHATSAPP_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    return new Response("OK", { status: 200 })
  } catch (e) {
    return new Response("Erro", { status: 500 })
  }
})
