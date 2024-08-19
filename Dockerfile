FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

COPY scripts/private/wait-for-postgres.sh /usr/local/bin/wait-for-postgres.sh
RUN chmod +x /usr/local/bin/wait-for-postgres.sh

RUN /usr/local/bin/wait-for-postgres.sh


EXPOSE 3333

CMD ["pnpm", "start:dev"]
