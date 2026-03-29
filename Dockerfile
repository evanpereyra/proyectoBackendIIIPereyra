FROM node:20.11.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY ./src ./src
COPY ./swagger ./swagger

ENV PORT=3000

EXPOSE 3000

CMD ["npm", "start"]
