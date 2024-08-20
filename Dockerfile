FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm install -g pnpm

RUN pnpm install

COPY . .

RUN pnpm build

ARG DATABASE_PUBLIC_URL
ENV DATABASE_URL=$DATABASE_PUBLIC_URL

RUN pnpm prisma migrate deploy

EXPOSE 3333

CMD ["pnpm", "start:prod"]
