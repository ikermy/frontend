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
ENV NUXT_PUBLIC_API_BASE_URL=$NUXT_PUBLIC_API_BASE_URL
ENV NUXT_PUBLIC_API_MODE=$NUXT_PUBLIC_API_MODE

ENV NODE_ENV=production

# Generate static SPA output (index.html + assets) for nginx
RUN npm run generate   # -> .output/public

# ============================================
# STAGE 2: Serve static files with nginx
# ============================================
FROM nginx:1.27-alpine
COPY --from=build /app/.output/public /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
