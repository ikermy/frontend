# ============================================
# STAGE 1: Build the static Nuxt app
# ============================================
FROM node:22-alpine AS build
WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json* ./
# Use --legacy-peer-deps: the committed lock was generated with this flag
# (peer dependency conflicts in the Nuxt dependency tree)
RUN npm install --legacy-peer-deps

COPY . .

# Build-time environment variables (public ones are inlined at build time)
ARG NUXT_PUBLIC_API_BASE_URL
ARG NUXT_PUBLIC_API_MODE
ARG NUXT_PUBLIC_TELEGRAM_BOT_USERNAME
ARG NUXT_PUBLIC_TELEGRAM_AUTH_URL
ENV NUXT_PUBLIC_API_BASE_URL=$NUXT_PUBLIC_API_BASE_URL
ENV NUXT_PUBLIC_API_MODE=$NUXT_PUBLIC_API_MODE
ENV NUXT_PUBLIC_TELEGRAM_BOT_USERNAME=$NUXT_PUBLIC_TELEGRAM_BOT_USERNAME
ENV NUXT_PUBLIC_TELEGRAM_AUTH_URL=$NUXT_PUBLIC_TELEGRAM_AUTH_URL

ENV NODE_ENV=production

# Generate static SPA output (index.html + assets) for nginx
RUN npm run generate   # -> .output/public

# ============================================
# STAGE 2: Serve static files with nginx
# ============================================
FROM nginx:1.27-alpine

# NGINX_TLS: "dev" — терминировать TLS на nginx (443, dev-сертификаты, /api/v1 → bff)
#            "prod" — только HTTP на 80 (HTTPS терминирует Envoy, /api/v1 → bff)
ARG NGINX_TLS=dev
ENV NGINX_TLS=$NGINX_TLS

COPY --from=build /app/.output/public /usr/share/nginx/html
# Удаляем дефолтный конфиг nginx (он не имеет SPA-fallback и конфликтует за port 80).
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/dev.conf
COPY nginx.prod.conf /etc/nginx/conf.d/prod.conf

# Выбор активного конфига по NGINX_TLS
RUN if [ "$NGINX_TLS" = "prod" ]; then \
      rm -f /etc/nginx/conf.d/dev.conf; \
    else \
      rm -f /etc/nginx/conf.d/prod.conf; \
    fi

EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
