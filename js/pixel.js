/*
 * Pixel do Meta — RO2D
 * Um arquivo para todas as páginas. Cada página só precisa de:
 *   <script defer src="/js/pixel.js" data-valor="9.99" data-produto="Luz para Cada Dia"
 *           data-checkout-api="https://webhook-luz-portal-dpa.bacjno.easypanel.host"></script>
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
 *
 * Checkout dinâmico (data-checkout-api): no clique, em vez de deixar o link
 * estático navegar, criamos um checkout novo carregando fbc/fbp/user-agent
 * do navegador — a AbacatePay devolve esses dados no webhook, e a Meta CAPI
 * manda com muito mais qualidade de correspondência. Sem data-checkout-api,
 * ou se a chamada falhar/demorar, cai de volta pro link estático original —
 * o checkout nunca pode travar por causa disso.
 */
(function () {
  'use strict';

  var s = document.currentScript || (function () {
    var all = document.getElementsByTagName('script');
    for (var i = all.length - 1; i >= 0; i--) if (/pixel\.js/.test(all[i].src)) return all[i];
    return null;
  })();

  var PIXEL_ID     = (s && s.getAttribute('data-pixel')) || window.RO2D_PIXEL_ID || '';
  var VALOR        = parseFloat((s && s.getAttribute('data-valor')) || '0') || 0;
  var PRODUTO      = (s && s.getAttribute('data-produto')) || document.title;
  var CHECKOUT_API = (s && s.getAttribute('data-checkout-api')) || '';
  var CHECKOUT_PRODUCT = (s && s.getAttribute('data-checkout-product')) || '';
  var produtosSemCheckout = {
    '/mentalidade-rica-vol2/': ['mentalidade-rica-vol2', 'https://app.abacatepay.com/pay/bill_CjuzGpjrczBMRXTpp15hKYCj'],
    '/mentalidade-rica-vol3/': ['mentalidade-rica-vol3', 'https://app.abacatepay.com/pay/bill_nEtBWPnbjjCqrtWwDuD6A65d'],
    '/eu-me-escolho-vol1/': ['eu-me-escolho-vol1', 'https://app.abacatepay.com/pay/bill_aJ3pHAYRAJa13XeAWewu5aF5'],
    '/eu-me-escolho-vol2/': ['eu-me-escolho-vol2', 'https://app.abacatepay.com/pay/bill_HZxrkZ4HR0JZeSwkZ5TrynUY'],
    '/eu-me-escolho-vol3/': ['eu-me-escolho-vol3', 'https://app.abacatepay.com/pay/bill_hpxhkcR516j6zrXyMXSHmDYc']
  };
  var checkoutFallback = '';
  if (!CHECKOUT_PRODUCT && produtosSemCheckout[location.pathname]) {
    CHECKOUT_PRODUCT = produtosSemCheckout[location.pathname][0];
    checkoutFallback = produtosSemCheckout[location.pathname][1];
    CHECKOUT_API = CHECKOUT_API || 'https://webhook-cards-portal-dpa.bacjno.easypanel.host';
  }

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

  function lerCookie(nome) {
    var m = document.cookie.match(new RegExp('(?:^|; )' + nome + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : '';
  }

  /**
   * `_fbc` só existe depois que o Pixel processa um clique vindo de anúncio
   * (?fbclid=...). Se a pessoa clicou no CTA antes disso rodar (raro, mas
   * acontece em conexão lenta), sintetiza no formato que a Meta documenta —
   * mesma origem de sinal, só que montada na hora em vez de ler do cookie.
   */
  function obterFbc() {
    var doCookie = lerCookie('_fbc');
    if (doCookie) return doCookie;
    var fbclid = (location.search.match(/[?&]fbclid=([^&]+)/) || [])[1];
    if (!fbclid) return '';
    return 'fb.1.' + Date.now() + '.' + fbclid;
  }

  function navegarParaCheckout(hrefEstatico) {
    location.href = hrefEstatico;
  }

  /* InitiateCheckout + checkout dinâmico — delegado, pega CTA adicionado depois também */
  document.addEventListener('click', function (ev) {
    var a = ev.target && ev.target.closest && ev.target.closest('a[data-checkout], a[href*="abacatepay.com/pay/"]');
    if (!a) return;

    try {
      fbq('track', 'InitiateCheckout', {
        content_name: PRODUTO,
        value: VALOR,
        currency: 'BRL'
      }, { eventID: id('ic') });
    } catch (e) {}

    // Sem endpoint de checkout dinâmico configurado nesta página: deixa o
    // link estático navegar normalmente, sem interceptar nada.
    if (!CHECKOUT_API || !CHECKOUT_PRODUCT) {
      if (a.href.indexOf('abacatepay.com/pay/') === -1) return;
      return;
    }

    ev.preventDefault();
    var hrefEstatico = checkoutFallback || a.href;

    var controle = (window.AbortController) ? new AbortController() : null;
    var timeout = controle && setTimeout(function () { controle.abort(); }, 3000);

    fetch(CHECKOUT_API + '/checkout/criar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fbc: obterFbc(),
        fbp: lerCookie('_fbp'),
        userAgent: navigator.userAgent,
        produto: CHECKOUT_PRODUCT
      }),
      signal: controle ? controle.signal : undefined
    })
      .then(function (resposta) { return resposta.ok ? resposta.json() : null; })
      .then(function (dados) {
        if (timeout) clearTimeout(timeout);
        navegarParaCheckout((dados && dados.url) || hrefEstatico);
      })
      .catch(function () {
        if (timeout) clearTimeout(timeout);
        // Checkout dinâmico falhou ou demorou — o pagamento não pode travar
        // por causa disso, cai pro link estático original.
        navegarParaCheckout(hrefEstatico);
      });
  }, true);
})();
