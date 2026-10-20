import http from "node:http";

// Read-only visual snapshot. Production source, CMS and Docker stay untouched.
const origin = "https://furkantoplu.com";
const port = 4175;
const choices = [
  ["F3F0E8", "1. seçenek"],
  ["FBFAF6", "2. seçenek"],
  ["EAE6DB", "Ek öneri"],
  ["F7F5F0", "Mevcut"],
];
const response = await fetch(`${origin}/`, { signal: AbortSignal.timeout(20_000) });
if (!response.ok) throw new Error(`Homepage snapshot failed: ${response.status}`);
const snapshot = (await response.text())
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
  .replace(/<link\b[^>]*rel="modulepreload"[^>]*>/gi, "")
  .replace(/<head([^>]*)>/i, `<head$1><base href="${origin}/">`);

function render(selected, showControls) {
  const styles = `<style id="local-color-preview">
    :root { --preview-paper: #${selected}; }
    body { background: var(--preview-paper) !important; }
    .site-shell { --public-paper: var(--preview-paper); }
    .color-preview { position:fixed; z-index:2147483647; bottom:16px; left:50%; transform:translateX(-50%); width:max-content; max-width:calc(100% - 24px); padding:12px; border:1px solid #c9c6bb; border-radius:12px; background:#fffefa; color:#173e34; box-shadow:0 5px 24px #173e3420; font:13px/1.4 "Segoe UI",Arial,sans-serif; }
    .color-preview[hidden], .color-preview-show[hidden] { display:none; }
    .color-preview__heading { display:flex; align-items:center; justify-content:space-between; gap:18px; margin-bottom:8px; }
    .color-preview__heading p { margin:0; font-size:11px; color:#52665d; }
    .color-preview__choices { display:flex; flex-wrap:wrap; gap:6px; }
    .color-preview button { cursor:pointer; font:inherit; color:inherit; }
    .color-preview__choice { display:flex; align-items:center; gap:8px; padding:8px 10px; background:transparent; border:1px solid #d6d7cf; border-radius:6px; text-align:left; }
    .color-preview__choice[aria-pressed="true"] { border-color:#173e34; outline:1px solid #173e34; }
    .color-preview__choice i { width:23px; height:23px; border:1px solid #bdbdb1; border-radius:50%; flex:none; }
    .color-preview__choice span { display:grid; font-size:11px; }
    .color-preview__choice strong { font-size:12px; }
    .color-preview__hide { border:0; background:none; text-decoration:underline; font-size:11px!important; }
    .color-preview-show { position:fixed; z-index:2147483647; right:16px; bottom:16px; border:1px solid #173e34; border-radius:6px; background:#fffefa; color:#173e34; padding:9px 14px; cursor:pointer; }
    @media(max-width:600px) { .color-preview { width:calc(100% - 24px); } .color-preview__choices { display:grid; grid-template-columns:1fr 1fr; } }
  </style>`;
  const controls = `<aside class="color-preview" aria-label="Yerel ana sayfa renk denemesi" ${showControls ? "" : "hidden"}>
    <div class="color-preview__heading"><div><strong>Yalnız yerel ana sayfa</strong><p>Zemin rengi karşılaştırması · diğer sayfalara geçiş kapalı</p></div><button class="color-preview__hide" type="button">Gizle</button></div>
    <div class="color-preview__choices">${choices.map(([color, label]) => `<button type="button" class="color-preview__choice" data-color="${color}" aria-pressed="${color === selected}"><i style="background:#${color}" aria-hidden="true"></i><span>${label}<strong>#${color}</strong></span></button>`).join("")}</div>
  </aside><button type="button" class="color-preview-show" ${showControls ? "hidden" : ""}>Renkleri karşılaştır</button>`;
  const behavior = `<script>
    const panel=document.querySelector('.color-preview');
    const show=document.querySelector('.color-preview-show');
    panel.querySelectorAll('[data-color]').forEach(button=>button.addEventListener('click',()=>{
      document.documentElement.style.setProperty('--preview-paper','#'+button.dataset.color);
      panel.querySelectorAll('[data-color]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
      const url=new URL(location.href);url.searchParams.set('renk',button.dataset.color);history.replaceState(null,'',url);
    }));
    panel.querySelector('.color-preview__hide').addEventListener('click',()=>{panel.hidden=true;show.hidden=false;});
    show.addEventListener('click',()=>{panel.hidden=false;show.hidden=true;});
    document.addEventListener('click',event=>{if(event.target.closest('a'))event.preventDefault();},true);
    document.addEventListener('submit',event=>event.preventDefault(),true);
  </script>`;
  return snapshot.replace("</head>", `${styles}</head>`).replace("</body>", `${controls}${behavior}</body>`);
}

http.createServer((request, result) => {
  const url = new URL(request.url, `http://127.0.0.1:${port}`);
  if (url.pathname !== "/") {
    result.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    result.end("Bu önizlemede yalnız ana sayfa var.");
    return;
  }
  const requested = url.searchParams.get("renk")?.toUpperCase();
  const selected = choices.some(([color]) => color === requested) ? requested : choices[0][0];
  result.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Robots-Tag": "noindex, nofollow",
  });
  result.end(render(selected, url.searchParams.get("kontroller") !== "0"));
}).listen(port, "127.0.0.1", () => {
  console.log(`Local homepage color preview: http://localhost:${port}/?renk=F3F0E8`);
  console.log("Read-only snapshot; assets use the public site. Ctrl+C stops the preview.");
});
