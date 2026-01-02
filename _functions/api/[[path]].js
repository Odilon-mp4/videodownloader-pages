export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  if (url.pathname === "/api/analyze") {
    return new Response(
      JSON.stringify({
        status: "ok",
        message: "API funcionando corretamente"
      }),
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }

  return new Response("Not Found", { status: 404 });
}
