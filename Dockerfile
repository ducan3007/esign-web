FROM 18.15.0-alpine as build

WORKDIR /app
COPY package.json /app
COPY package-lock.json /app
RUN npm install

COPY . /app

RUN npx nx run-many --target=build --projects=esign-web






