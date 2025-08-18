FROM node:20-alpine 

WORKDIR /app

ENV NODE_ENV=development
ENV PORT=5000

COPY package*.json ./

RUN npm i

RUN npm install -g nodemon

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]