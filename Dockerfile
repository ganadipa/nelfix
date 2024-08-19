FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

RUN pnpm build

RUN pnpm prisma generate && pnpm prisma migrate dev && pnpm prisma generate

EXPOSE 3333

CMD ["pnpm", "start:dev"]
