ARG DOCKER_HUB="docker.io"
ARG NGINX_VERSION="1.17.6"
ARG NODE_VERSION="20-alpine"

FROM $DOCKER_HUB/library/node:$NODE_VERSION as build


COPY . /workspace/

ARG NPM_REGISTRY=" https://registry.npmjs.org"

RUN echo "registry = \"$NPM_REGISTRY\"" > /workspace/.npmrc                              && \
    cd /workspace/                                                                       && \
    npm install                                                                          && \
    npm run build

FROM $DOCKER_HUB/library/nginx:$NGINX_VERSION AS runtime


COPY  --from=build /workspace/dist/ /usr/share/nginx/html/

RUN chmod a+rwx /var/cache/nginx /var/run /var/log/nginx                        && \
    sed -i.bak 's/listen\(.*\)80;/listen 8080;/' /etc/nginx/conf.d/default.conf && \
    sed -i.bak 's/^user/#user/' /etc/nginx/nginx.conf                          && \
    printf 'server {\n  listen 8080;\n  root /usr/share/nginx/html;\n  index index.html;\n  location / {\n    try_files $uri $uri/ /index.html;\n  }\n}\n' > /etc/nginx/conf.d/default.conf


EXPOSE 8080

USER nginx

HEALTHCHECK     CMD     [ "service", "nginx", "status" ]


