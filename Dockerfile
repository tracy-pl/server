FROM node:alpine

WORKDIR /app
COPY package.json yarn.lock ./

RUN apk add --no-cache make gcc g++ python3 && \
npm install -g yarn && \
yarn install --frozen-lockfile --no-scripts && \
npm rebuild bcrypt -build-from-source && \
apk del make gcc g++ python3

COPY ./ ./
RUN npm run build

CMD ["node", "dist/main"]
