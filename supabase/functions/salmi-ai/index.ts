import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

// ENCABEZADOS CORS UNIFICADOS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  // Manejar el prefligth (OPTIONS) de CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Obtener IDENTIDAD del usuario (Seguridad)
    const authHeader = req.headers.get('Authorization');
    console.log("Salmi AI: Recibiendo mensaje...");

    let userContext = "";
    if (authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (user && !authError) {
          // Obtener perfil detallado del usuario actual
          const { data: profile } = await supabase
            .from('user')
            .select('name, role, program, semester')
            .eq('id', user.id)
            .single();
          
          if (profile) {
            console.log(`Salmi AI: Usuario identificado como ${profile.name}`);
            userContext = `ESTÁS HABLANDO CON: ${profile.name} (${profile.role}). 
            Su programa actual es: ${profile.program || 'N/A'}. 
            Semestre: ${profile.semester || 'N/A'}.`;
          }
        }
      } catch (e) {
        console.error("Salmi AI: Error decodificando auth", e);
      }
    } else {
      console.log("Salmi AI: Petición sin cabecera de autorización");
    }

    // 2. Obtener información institucional y académica (RAGContext)
    const { data: info } = await supabase.from('university_info').select('*');
    const { data: programs } = await supabase.from('academic_programs').select('*');

    const contextText = `
    DATOS DEL USUARIO ACTUAL (CONFIDENCIAL):
    ${userContext}

    CONOCIMIENTO INSTITUCIONAL UNISALAMANCA:
    ${info?.map((i: any) => `- ${i.category.toUpperCase()}: ${i.content}`).join('\n')}

    PROGRAMAS ACADÉMICOS DISPONIBLES:
    ${programs?.map((p: any) => `- ${p.name} (${p.program_type}): ${p.description}. Perfil: ${p.career_profile}`).join('\n')}
    `;

    // 3. Llamar a Groq (Llama-3.3)
    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");

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
            content: `Eres Salmi, la mascota ardilla oficial de UniSalamanca. 
            
            PERSONALIDAD:
            - Eres una ardilla de negocios inteligente, amable y muy rápida.
            - Usa frases como "¡Bellota!" o algo relacionado con ardillas ocasionalmente (10%).
            - Tono: Profesional pero cercano y motivador.
            
            PRIVACIDAD Y REGLAS:
            1. Solo conoces datos del USUARIO ACTUAL que se te provee. No inventes datos de otros alumnos.
            2. Tienes PROHIBIDO revelar información personal de un estudiante a otro. 
            3. Si un alumno pregunta por "otro alumno", responde que por políticas de privacidad solo tratas sus propios datos.
            4. Usa el contexto institucional para responder sobre carreras y bienestar.
            
            CONTEXTO:\n${contextText}`
          },
          { role: "user", content: message }
        ],
        temperature: 0.6,
        max_tokens: 450,
      }),
    });

    const groqData = await response.json();
    const aiResponse = groqData.choices[0].message.content;

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error("AI Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
