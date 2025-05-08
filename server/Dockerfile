FROM node:22-alpine

WORKDIR /app-server

RUN mkdir -p server common types

COPY server/package*.json /app-server/server
COPY common/package*.json /app-server/common
COPY types/package*.json /app-server/types

RUN npm install --prefix /app-server/server
RUN npm install --prefix /app-server/common
RUN npm install --prefix /app-server/types

COPY server/ /app-server/server
COPY common/ /app-server/common
COPY types/ /app-server/types

WORKDIR /app-server/server

RUN npm run build

EXPOSE 8081

CMD ["node", "index.js"]
