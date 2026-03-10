# ---- build stage ----
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml* yarn.lock* package-lock.json* ./

RUN \
  if [ -f pnpm-lock.yaml ]; then corepack enable && pnpm i --frozen-lockfile; \
  elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  else npm ci; \
  fi

COPY . .
RUN npm run build

# ---- run stage ----
FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html

# SPA fallback (React Router etc.)
RUN printf '%s\n' \
'server {' \
'  listen 80;' \
'  server_name _;' \
'  root /usr/share/nginx/html;' \
'  index index.html;' \
'  location / {' \
'    try_files $uri $uri/ /index.html;' \
'  }' \
'}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
