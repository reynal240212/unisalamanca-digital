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
        const { data, error: authError } = await supabase.auth.getUser(token);

        if (data?.user && !authError) {
          const user = data.user;
          // Obtener perfil detallado del usuario actual
          const { data: profile } = await supabase
            .from('user')
            .select('name, role, program, semester')
            .eq('id', user.id)
            .single();
          
          if (profile) {
            console.log(`Salmi AI: Usuario identificado como ${profile.name}`);
            userContext = `ESTÁS HABLANDO CON: ${profile.name} (Rol: ${profile.role}). 
            Programa actual: ${profile.program || 'No definido aún'}. 
            Semestre: ${profile.semester || 'No definido'}.`;
          }
        }
      } catch (e) {
        console.error("Salmi AI: Error decodificando auth", e);
        // Continuamos sin contexto de usuario en lugar de fallar
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

    if (!GROQ_API_KEY) {
      console.error("Salmi AI: ERROR - GROQ_API_KEY no configurada en las variables de entorno.");
      return new Response(JSON.stringify({ 
        response: "¡Bellota! Parece que me falta mi combustible (API Key). Por favor, dile al administrador que verifique la configuración de Groq." 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
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
            content: `Eres el Asistente Digital Oficial de UniSalamanca. 
            
            REGLAS DE RESPUESTA:
            1. TONO: Profesional, directo y ejecutivo. No uses lenguaje informal ni referencias a animales (ardillas, bellotas).
            2. ESTRUCTURA: Usa viñetas o listas numeradas para información múltiple. Evita párrafos largos.
            3. BREVEDAD: Responde de forma concisa. Si la respuesta es larga, resume los puntos clave.
            4. PRIVACIDAD: Solo conoces datos del USUARIO ACTUAL que se te provee. No reveles información personal de un estudiante a otro. 
            5. CONTEXTO: Usa estrictamente la información institucional para responder.
            
            CONTEXTO:\n${contextText}`
          },
          { role: "user", content: message }
        ],
        temperature: 0.6,
        max_tokens: 450,
      }),
    });

    const groqData = await response.json();
    
    if (!response.ok) {
      console.error("Groq API Error:", groqData);
      return new Response(JSON.stringify({ 
        response: "¡Bellota! Mis circuitos están un poco lentos ahora mismo. ¿Podrías intentar preguntarme de nuevo en un momento?" 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (!groqData?.choices?.[0]?.message?.content) {
      console.error("Groq returned unexpected structure:", groqData);
      throw new Error("Estructura de respuesta de IA inválida.");
    }

    const aiResponse = groqData.choices[0].message.content;

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error("Salmi AI Final Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Error desconocido en el motor de IA";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
