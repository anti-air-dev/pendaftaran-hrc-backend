# --- Stage 1: Base ---
FROM node:20-alpine AS base
WORKDIR /usr/src/app
COPY package*.json ./

# --- Stage 2: Development ---
FROM base AS development
RUN npm install
COPY . .
# Pastikan port ini sama dengan yang ada di app.listen(5000)
EXPOSE 5000
CMD ["npm", "run", "dev"]