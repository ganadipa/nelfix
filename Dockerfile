FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -g pnpm


RUN pnpm install

COPY . .

EXPOSE 3333

CMD ["pnpm", "start:dev"]
