FROM node:18-alpine

# Instala pg_isready en Alpine
RUN apk add --no-cache postgresql-client

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]