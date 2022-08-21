FROM node:14.17.0

RUN apt-get update && \
    apt-get install -y clamav clamav-daemon

WORKDIR /app

COPY ./scripts ./scripts
COPY ./test ./test
COPY ./locales ./locales
COPY ./certificates ./certificates

COPY ./*.json ./
COPY ./cli ./cli

RUN npm install

COPY ./src ./src
COPY ./entrypoint.dev.sh ./entrypoint.dev.sh

ENTRYPOINT [ "/app/entrypoint.dev.sh" ]
