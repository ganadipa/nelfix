FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

RUN pnpm prisma generate

# Copy the wait-for-it.sh script from the scripts directory
COPY scripts/wait-for-it.sh wait-for-it.sh
RUN chmod +x wait-for-it.sh


EXPOSE 3333

CMD ["pnpm", "start:dev"]
