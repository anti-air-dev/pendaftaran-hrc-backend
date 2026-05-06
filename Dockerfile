# --- Stage 1: Base (Bahan Dasar) ---
FROM node:24-alpine AS base
WORKDIR /usr/src/app
COPY package*.json ./

# --- Stage 2: Development (Digunakan untuk coding) ---
FROM base AS development
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]

# --- Stage 3: Production (Hasil akhir yang ringan) ---
FROM base AS production
ENV NODE_ENV=production
RUN npm install --only=production
COPY . .
CMD ["node", "server.js"]