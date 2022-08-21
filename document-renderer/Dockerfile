FROM node:12.18.3

WORKDIR /app

COPY ./package.json .
RUN npm install
COPY . .

EXPOSE 4300

RUN npm run build

ENTRYPOINT [ "npm" ]
CMD [ "start"]
