export async function onRequest(context) {
  const { request } = context;

  // 1) Permitir apenas POST
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  // 2) Validar Origin / Referer
  const origin = request.headers.get("Origin") || "";
  const referer = request.headers.get("Referer") || "";

  const allowedOrigins = [
    "https://videodownloader-pages.pages.dev",
    "https://www.ogttranslate.com"
  ];

  const isAllowed = allowedOrigins.some(o =>
    origin.startsWith(o) || referer.startsWith(o)
  );

  if (!isAllowed) {
    return new Response(
      JSON.stringify({ error: "Origem não autorizada" }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await request.json();
    const videoUrl = body.url;

    if (!videoUrl) {
      return new Response(
        JSON.stringify({ error: "URL não fornecida" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // ===== SUA CHAMADA RAPIDAPI (EXISTENTE) =====
    const rapidResponse = await fetch(
      "https://social-download-all-in-one.p.rapidapi.com/v1/social/autolink",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": "SUA_CHAVE_ATUAL",
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
      medias: Array.isArray(raw?.medias)
        ? raw.medias
            .filter(m => m && m.url)
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
        "Access-Control-Allow-Origin": allowedOrigins[0]
      }
    });

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
