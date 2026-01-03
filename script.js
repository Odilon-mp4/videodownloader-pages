document.getElementById("analyzeBtn").addEventListener("click", async () => {
  const url = document.getElementById("videoUrl").value;
  if (!url) {
    alert("Cole um link de vídeo");
    return;
  }

  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url })
  });

  const data = await res.json();

  document.getElementById("title").innerText = data.title;
  document.getElementById("thumbnail").src = data.thumbnail;

  const downloads = document.getElementById("downloads");
  downloads.innerHTML = "";

  data.medias.forEach(media => {
    const a = document.createElement("a");
    a.href = media.url;
    a.target = "_blank";
    a.innerText = `${media.quality} - ${media.type}`;
    downloads.appendChild(a);
  });
});
