export async function onRequest(context) {
  try {
    const { request } = context;

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const body = await request.json();
    const videoUrl = body.url;

    if (!videoUrl) {
      return new Response(JSON.stringify({ error: "URL não fornecida" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    // =========================================================
    // ⚠️ COLE AQUI A SUA CHAMADA ATUAL DA RAPIDAPI (SEM ALTERAR)
    // =========================================================

    /*
    EXEMPLO (NÃO USE ESTE, USE O SEU):

    const rapidResponse = await fetch("https://SUA-RAPIDAPI-ENDPOINT", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": "SUA_API_KEY",
        "X-RapidAPI-Host": "SUA_API_HOST"
      },
      body: JSON.stringify({ url: videoUrl })
    });
    */

    // 👉 AQUI EMBAIXO É O QUE IMPORTA:
    // ASSUMIMOS QUE SUA RESPOSTA JÁ EXISTE
    // E QUE VOCÊ JÁ FAZ:
    //
    // const result = await rapidResponse.json();

    // =========================================================

    const result = await rapidResponse.json();

    // ================= NORMALIZAÇÃO =================

    const raw = result?.data || result;

    const normalized = {
      title: raw?.title || "",
      thumbnail: raw?.thumbnail || "",
      source: raw?.source || "",
      medias: []
    };

    if (Array.isArray(raw?.medias)) {
      normalized.medias = raw.medias
        .filter(m => m && m.url)
        .map(m => ({
          url: m.url,
          quality: m.quality || "",
          type: m.type || ""
        }));
    }

    return new Response(JSON.stringify(normalized), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  }
}
