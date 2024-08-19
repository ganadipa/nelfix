FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

COPY scripts/private/wait-for-db.sh /usr/local/bin/wait-for-db.sh
RUN chmod +x /usr/local/bin/wait-for-db.sh

RUN /usr/local/bin/wait-for-db.sh


EXPOSE 3333

CMD ["pnpm", "start:dev"]
