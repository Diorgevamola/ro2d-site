/* Banner de cookies + carga condicionada del Pixel de Meta (RGPD / ePrivacy).
   - Nada se carga antes de aceptar. Aceptar y rechazar tienen el mismo peso visual.
   - PENDENTE: poner el ID del pixel NUEVO de España en PIXEL_ID (hoy vacío = no carga nada aunque se acepte). */
(function () {
  var PIXEL_ID = ""; // PENDENTE
  var KEY = "p72_consent";
  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function loadPixel() {
    if (!PIXEL_ID || window.fbq) return;
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s)
    }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    fbq("init", PIXEL_ID);
    fbq("track", "PageView");
    if (window.P72_PURCHASE) {
      // eventID compartido con la API de conversiones para evitar doble conteo
      fbq("track", "Purchase", { value: 14.9, currency: "EUR" }, { eventID: window.P72_PURCHASE });
    }
  }

  function banner() {
    var d = document.createElement("div");
    d.setAttribute("role", "dialog"); d.setAttribute("aria-label", "Cookies");
    d.style.cssText = "position:fixed;left:0;right:0;bottom:0;z-index:99;background:#0b1322;border-top:1px solid #1f2c42;color:#eaf0f8;padding:1rem;font:14px/1.5 system-ui,Arial,sans-serif";
    var btn = "flex:1;min-width:130px;padding:.7rem 1rem;border-radius:10px;border:1px solid #f8b040;background:#121b2d;color:#fff;font-weight:700;cursor:pointer;font-size:14px";
    d.innerHTML = '<div style="max-width:820px;margin:auto"><p style="margin:0 0 .8rem">Usamos cookies de medición y publicidad (Meta) solo si las aceptas. Puedes rechazarlas sin perder nada. Más información en la <a href="' + (location.pathname.indexOf("gracias") > -1 ? "../" : "") + 'legal/#cookies" style="color:#f8b040">política de cookies</a>.</p>' +
      '<div style="display:flex;gap:.6rem;flex-wrap:wrap"><button id="p72n" style="' + btn + '">Rechazar</button><button id="p72y" style="' + btn + '">Aceptar</button></div></div>';
    document.body.appendChild(d);
    document.getElementById("p72y").onclick = function () { set("yes"); d.remove(); loadPixel(); };
    document.getElementById("p72n").onclick = function () { set("no"); d.remove(); };
  }

  function init() {
    var c = get();
    if (c === "yes") loadPixel();
    else if (c !== "no") banner();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
