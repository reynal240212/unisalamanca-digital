import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

Deno.serve(async (req: Request) => {
  const { message } = await req.json();

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const supabase = createClient(supabaseUrl, supabaseKey);

  // 1. Obtener toda la información institucional (Contexto)
  const { data: info } = await supabase.from('university_info').select('*');
  const { data: programs } = await supabase.from('academic_programs').select('*');

  // Convertir a texto legible por la IA
  const contextText = `
  CONOCIMIENTO INSTITUCIONAL UNISALAMANCA:
  ${info?.map(i => `- ${i.category.toUpperCase()} (${i.title}): ${i.content}`).join('\n')}

  PROGRAMAS ACADÉMICOS:
  ${programs?.map(p => `- ${p.name} (${p.program_type}): ${p.description}. Duración: ${p.duration}. Perfil de Egresado: ${p.career_profile}`).join('\n')}
  `;

  // 2. Llamar a Groq (Llama-3) mediante variable de entorno SEGURA
  const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");

  if (!GROQ_API_KEY) {
    return new Response(JSON.stringify({ error: "No se encontró la llave de Groq (GROQ_API_KEY)" }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `Eres Salmi, la mascota oficial y mentora digital de la Corporación Universitaria Empresarial de Salamanca (UniSalamanca). Tu personalidad es amable, motivadora, profesional y un poco divertida (eres una ardilla de negocios). 
          
          REGLAS:
          1. Usa SIEMPRE el contexto proporcionado para responder sobre la universidad.
          2. Si no sabes algo basado en el contexto, sugiere contactar a Bienestar o Admisiones.
          3. Mantén respuestas concisas pero completas. Usa emojis pertinentes.
          4. No rompas el personaje. Eres un mentor digital de UniSalamanca.
          
          CONTEXTO INSTITUCIONAL:
          ${contextText}`
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    }),
  });

  const groqData = await response.json();
  const aiResponse = groqData.choices[0].message.content;

  return new Response(JSON.stringify({ response: aiResponse }), {
    headers: {
      'Content-Type': 'application/json',
      'Connection': 'keep-alive'
    }
  });
});
