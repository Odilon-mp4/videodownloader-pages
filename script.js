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

  resultado.style.display = "none";
  titleEl.textContent = "";
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

    data.medias.forEach(media => {
      const btn = document.createElement("a");
      btn.href = media.url;
      btn.target = "_blank";
      btn.style.display = "block";
      btn.style.marginTop = "8px";
      btn.style.padding = "10px";
      btn.style.background = "#4f46e5";
      btn.style.color = "#fff";
      btn.style.textAlign = "center";
      btn.style.borderRadius = "4px";
      btn.style.textDecoration = "none";

      const label = [];
      if (media.quality) label.push(media.quality);
      if (media.type) label.push(media.type);

      btn.textContent = "Download " + label.join(" ");

      downloadsEl.appendChild(btn);
    });

  } catch (e) {
    alert("Erro ao analisar vídeo: " + e.message);
  }
}
