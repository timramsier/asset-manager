FROM node:8.1.4-alpine
LABEL maintainer "Tim Ramsier"

RUN mkdir /var/www

WORKDIR /var/www

COPY . .

RUN npm install

CMD ["npm", "run", "start"]
