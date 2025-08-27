FROM node:20-bullseye-slim

# Installer les dépendances système nécessaires pour argon2
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    netcat \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances avec rebuild pour l'architecture cible
RUN npm ci && npm rebuild argon2

# Copier le code source
COPY . .

EXPOSE 8000

CMD ["npm", "run", "dev"]