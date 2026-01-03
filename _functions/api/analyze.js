export async function onRequest(context) {
  try {
    const { request } = context;

    // ✅ CORREÇÃO: responder preflight CORS
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }

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

    // ===== CHAMADA REAL DA RAPIDAPI =====
    const rapidResponse = await fetch(
      "https://social-download-all-in-one.p.rapidapi.com/v1/social/autolink",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": "c4ea9e070dmshe70fcb1386c9a9p184528jsncc1d519cfa30",
          "X-RapidAPI-Host": "social-download-all-in-one.p.rapidapi.com"
        },
        body: JSON.stringify({ url: videoUrl })
      }
    );

    if (!rapidResponse.ok) {
      throw new Error("Erro na RapidAPI");
    }

    const result = await rapidResponse.json();

    // ===== NORMALIZAÇÃO =====
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
