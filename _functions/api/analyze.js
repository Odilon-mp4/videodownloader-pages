export async function onRequest() {
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
