export async function onRequest({ request }) {
  try {
    // ===== CORS =====
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

    // ⚠️ NÃO BLOQUEIE MÉTODO AQUI
    // Deixe o Pages passar o POST normalmente

    const body = await request.json().catch(() => null);
    const videoUrl = body?.url;

    if (!videoUrl) {
      return new Response(JSON.stringify({ error: "URL não fornecida" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    // ===== RAPIDAPI =====
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
      return new Response(
        JSON.stringify({ error: "Erro RapidAPI", status: rapidResponse.status }),
        {
          status: 502,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    }

    const result = await rapidResponse.json();

    // ===== NORMALIZAÇÃO =====
    const raw = result?.data || result;

    const normalized = {
      title: raw?.title || "",
      thumbnail: raw?.thumbnail || "",
      source: raw?.source || "",
      medias: Array.isArray(raw?.medias)
        ? raw.medias
            .filter(m => m?.url)
            .map(m => ({
              url: m.url,
              quality: m.quality || "",
              type: m.type || ""
            }))
        : []
    };

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
