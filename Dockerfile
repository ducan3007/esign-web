FROM node:18.15.0-alpine as builder

WORKDIR /app
COPY package.json /app
COPY package-lock.json /app
RUN npm install
COPY . /app
RUN npx nx run-many --target=build --projects=esign-web

FROM node:18.15.0-alpine
WORKDIR /app
COPY --from=builder /app/dist /app
COPY ./deploy /app
RUN npm install --production

EXPOSE 4008/tcp
ENTRYPOINT ["node", "server.js"]



