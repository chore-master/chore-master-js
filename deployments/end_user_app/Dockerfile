FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY apps/end-user-app/package*.json ./apps/end-user-app/

RUN npm install

COPY packages/utils/ /app/packages/utils
COPY apps/end-user-app/ /app/apps/end-user-app

WORKDIR /app/apps/end-user-app

ARG NEXT_PUBLIC_ENV_NAME
ARG NEXT_PUBLIC_CHORE_MASTER_API_HOST

ENV NEXT_PUBLIC_ENV_NAME=${NEXT_PUBLIC_ENV_NAME}
ENV NEXT_PUBLIC_CHORE_MASTER_API_HOST=${NEXT_PUBLIC_CHORE_MASTER_API_HOST}

RUN npm run build

ENV NODE_ENV=production

CMD ["npm", "start"]