FROM node:18.12.0-alpine

WORKDIR /app
COPY package.json yarn.lock ./

RUN apk add --no-cache make gcc g++ python3 && \
yarn install --frozen-lockfile --no-scripts && \
npm rebuild bcrypt -build-from-source && \
apk del make gcc g++ python3

COPY ./ ./
RUN yarn run build

CMD ["node", "dist/src/main"]
