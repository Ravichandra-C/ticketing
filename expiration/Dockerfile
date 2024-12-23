FROM node:alpine
WORKDIR /app
COPY ./package.json ./
RUN npm install
COPY . .
# CMD [ "sleep" ,"infinity" ]
CMD [ "npm","start" ]