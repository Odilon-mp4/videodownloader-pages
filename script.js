document.getElementById("analyzeBtn").addEventListener("click", analisar);

async function analisar() {
  const resultado = document.getElementById("resultado");
  const url = document.getElementById("videoUrl").value;

  if (!url) {
    resultado.textContent = "Cole uma URL válida.";
    return;
  }

  resultado.textContent = "Processando...";

  try {
    const response = await fetch(
      "https://video-api.odilonufs007.workers.dev/api/analyze",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url })
      }
    );

    if (!response.ok) {
      throw new Error("Erro HTTP " + response.status);
    }

    const data = await response.json();
    resultado.textContent = JSON.stringify(data, null, 2);

  } catch (e) {
    resultado.textContent = "Erro ao chamar a API:\n" + e.message;
  }
}
