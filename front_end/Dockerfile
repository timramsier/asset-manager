FROM node:8.1.4-alpine
MAINTAINER Tim Ramsier

RUN mkdir /var/www

WORKDIR /var/www

COPY . .

RUN npm install && npm install -g nodemon && npm cache clear --force

CMD ["npm", "run", "container"]
