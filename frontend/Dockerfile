FROM node:22-bookworm-slim AS build

WORKDIR /app

ARG DIRECTUS_URL=http://directus:8055
ENV DIRECTUS_URL=${DIRECTUS_URL}

COPY package.json package-lock.json ./
RUN npm ci --include=dev --include=optional --no-audit --no-fund

COPY . .
RUN npm run build

FROM node:22-bookworm-slim AS runtime

ENV NODE_ENV=production \
    WRANGLER_SEND_METRICS=false \
    WRANGLER_WRITE_LOGS=false

WORKDIR /app

RUN npm install --global wrangler@4.92.0 --no-audit --no-fund \
    && npm cache clean --force

COPY --from=build /app/dist ./dist

RUN mkdir -p /app/.wrangler /app/dist/server/.wrangler \
    && chown -R node:node /app

EXPOSE 3000

USER node

CMD ["wrangler", "dev", "--config", "dist/server/wrangler.json", "--local", "--ip", "0.0.0.0", "--port", "3000", "--inspector-port", "0"]
