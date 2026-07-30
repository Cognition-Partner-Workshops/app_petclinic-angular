ARG DOCKER_HUB="docker.io"
ARG NGINX_VERSION="1.25-alpine"
ARG NODE_VERSION="18-alpine"

FROM $DOCKER_HUB/library/node:$NODE_VERSION AS build

COPY . /workspace/

ARG NPM_REGISTRY=" https://registry.npmjs.org"

RUN echo "registry = \"$NPM_REGISTRY\"" > /workspace/.npmrc                              && \
    cd /workspace/                                                                       && \
    npm install                                                                          && \
    npx ng build --configuration=docker

FROM $DOCKER_HUB/library/nginx:$NGINX_VERSION AS runtime

RUN apk add --no-cache curl

COPY --from=build /workspace/dist/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN chmod a+rwx /var/cache/nginx /var/run /var/log/nginx                        && \
    sed -i.bak 's/^user/#user/' /etc/nginx/nginx.conf

EXPOSE 8080

USER nginx

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1
