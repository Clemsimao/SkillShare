FROM node:20

# Installer netcat pour l'attente Postgres qui n' est pas present dans node:20
RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV NODE_ENV=development
ENV PORT=8000

COPY package*.json ./

RUN npm i

RUN npm install -g nodemon

COPY . .

EXPOSE 8000

CMD ["npm", "run", "dev"]