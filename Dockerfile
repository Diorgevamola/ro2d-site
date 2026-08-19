FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Institucional na raiz
COPY index.html /usr/share/nginx/html/index.html
COPY img/ /usr/share/nginx/html/img/

# Landing dos 300 Cards em /cards_seguranca_familiar/ — precisa ser copiada explicitamente,
# senão o nginx devolve o HTML da raiz no lugar do conteúdo.
COPY cards_seguranca_familiar/ /usr/share/nginx/html/cards_seguranca_familiar/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]
