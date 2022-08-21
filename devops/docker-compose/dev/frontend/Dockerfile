FROM node:12.18.3

WORKDIR /app

COPY ./*.json ./
RUN npm install

COPY ./src ./src
COPY .browserslistrc express.js ./

EXPOSE 4200

ENTRYPOINT [ "npm" ]

CMD [ "run", "build-serve"]
