/*
 * Pixel do Meta — RO2D
 * Um arquivo para todas as páginas. Cada página só precisa de:
 *   <script defer src="/js/pixel.js" data-valor="9.99" data-produto="Luz para Cada Dia"></script>
 *
 * O que dispara sozinho:
 *   PageView         — toda página
 *   InitiateCheckout — clique em qualquer link do checkout (app.abacatepay.com/pay/)
 *
 * Purchase NÃO é disparado por aqui. O webhook de pagamento (webhook-cards/
 * webhook-luz/webhook-palavra) já manda Purchase pra Meta Conversions API a
 * partir do pagamento CONFIRMADO pela AbacatePay — client-side só sabia dizer
 * "alguém visitou a página de obrigado", o que inflava a contagem sem garantir
 * pagamento real. Ver webhook-kiwify-cards/src/metaCapi.ts.
 */
(function () {
  'use strict';

  var s = document.currentScript || (function () {
    var all = document.getElementsByTagName('script');
    for (var i = all.length - 1; i >= 0; i--) if (/pixel\.js/.test(all[i].src)) return all[i];
    return null;
  })();

  var PIXEL_ID = (s && s.getAttribute('data-pixel')) || window.RO2D_PIXEL_ID || '';
  var VALOR    = parseFloat((s && s.getAttribute('data-valor')) || '0') || 0;
  var PRODUTO  = (s && s.getAttribute('data-produto')) || document.title;

  // Sem ID configurado não faz nada — evita erro no console e evento fantasma.
  if (!/^\d{5,}$/.test(PIXEL_ID)) {
    if (window.console && console.info) console.info('[ro2d] pixel nao configurado; nenhum evento enviado');
    return;
  }

  /* snippet oficial do Meta */
  !function(f,b,e,v,n,t,s2){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s2=b.getElementsByTagName(e)[0];s2.parentNode.insertBefore(t,s2)}
  (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');

  fbq('init', PIXEL_ID);
  fbq('track', 'PageView');

  function id(prefixo) {
    return prefixo + '_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10);
  }

  /* InitiateCheckout — delegado, pega CTA adicionado depois também */
  document.addEventListener('click', function (ev) {
    var a = ev.target && ev.target.closest && ev.target.closest('a[href*="abacatepay.com/pay/"]');
    if (!a) return;
    try {
      fbq('track', 'InitiateCheckout', {
        content_name: PRODUTO,
        value: VALOR,
        currency: 'BRL'
      }, { eventID: id('ic') });
    } catch (e) {}
  }, true);
})();
