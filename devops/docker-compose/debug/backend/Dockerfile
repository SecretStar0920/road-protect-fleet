FROM node:14.17.0

WORKDIR /app

COPY ./scripts ./scripts
COPY ./test ./test
COPY ./locales ./locales
COPY ./certificates ./certificates

COPY ./*.json ./
COPY ./cli ./cli

RUN npm install

COPY ./src ./src

ENTRYPOINT [ "npm" ]

RUN npm run build

CMD [ "run", "start:dev:nodemon" ]
