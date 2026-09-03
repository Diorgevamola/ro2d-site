FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia o site inteiro de uma vez (regras de exclusão em .dockerignore) em vez de
# listar pasta por pasta — evitar que um produto novo suba sem o COPY correspondente
# e vire 404 em produção (já aconteceu).
COPY . /usr/share/nginx/html/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]
