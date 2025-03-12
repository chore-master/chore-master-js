FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY packages/end-user-app/package*.json ./packages/end-user-app/

RUN npm install

COPY packages/utils/ /app/packages/utils
COPY packages/end-user-app/ /app/packages/end-user-app

WORKDIR /app/packages/end-user-app
RUN npm run build

ENV NODE_ENV=production

CMD ["npm", "start"]