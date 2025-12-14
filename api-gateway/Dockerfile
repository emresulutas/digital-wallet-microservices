# api-gateway/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Paket listesini kopyala ve yükle
COPY package*.json ./
RUN npm install

# Tüm proje kodlarını kopyala
COPY . .

# Uygulamayı başlat
CMD ["npm", "run", "start:dev"]