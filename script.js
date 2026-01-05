document.getElementById("analyzeBtn").addEventListener("click", analisar);

async function analisar() {
  const url = document.getElementById("videoUrl").value.trim();

  const resultado = document.getElementById("resultado");
  const titleEl = document.getElementById("title");
  const thumbEl = document.getElementById("thumbnail");
  const downloadsEl = document.getElementById("downloads");

  if (!url) {
    alert("Cole uma URL válida.");
    return;
  }

  // Reset UI
  resultado.style.display = "none";
  titleEl.textContent = "";
  thumbEl.src = "";
  downloadsEl.innerHTML = "";

  try {
    const response = await fetch("https://video-api.odilonufs007.workers.dev", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    });

    if (!response.ok) {
      throw new Error("Erro HTTP " + response.status);
    }

    const data = await response.json();

    titleEl.textContent = data.title || "Sem título";
    thumbEl.src = data.thumbnail;
    resultado.style.display = "block";

    if (!data.medias || data.medias.length === 0) {
      downloadsEl.innerHTML = "<p>Nenhuma mídia disponível.</p>";
      return;
    }

    // Criar botões de download com página intermediária
    data.medias.forEach(media => {
      const btn = document.createElement("button");

      const label = [];
      if (media.quality) label.push(media.quality);
      if (media.type) label.push(media.type);

      btn.textContent = "Download " + label.join(" ");

      btn.style.display = "block";
      btn.style.marginTop = "8px";
      btn.style.padding = "10px";
      btn.style.background = "#4f46e5";
      btn.style.color = "#fff";
      btn.style.border = "none";
      btn.style.borderRadius = "4px";
      btn.style.cursor = "pointer";
      btn.style.fontSize = "14px";

      btn.addEventListener("click", () => {
        const encodedUrl = encodeURIComponent(media.url);
        window.location.href = `/download.html?url=${encodedUrl}`;
      });

      downloadsEl.appendChild(btn);
    });

  } catch (e) {
    alert("Erro ao analisar vídeo: " + e.message);
  }
}
