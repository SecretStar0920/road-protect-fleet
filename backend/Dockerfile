# BUILD
FROM node:14.17.0 as builder

ENV NODE_ENV build

WORKDIR /app

COPY ./scripts ./scripts
COPY ./test ./test
COPY ./emails ./emails
COPY ./locales ./locales
COPY ./certificates ./certificates

COPY ./*.json ./
COPY ./cli ./cli

COPY ./entrypoint.prod.sh ./entrypoint.prod.sh

RUN npm ci

COPY ./src ./src

RUN npm run build

# Prod image
FROM node:14.17.0

RUN apt-get update && \
    apt-get install -y clamav clamav-daemon

ENV NODE_ENV production

WORKDIR /app

COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/test ./test
COPY --from=builder /app/emails ./emails
COPY --from=builder /app/locales ./locales
COPY --from=builder /app/certificates ./certificates
COPY --from=builder /app/*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/cli ./cli
COPY --from=builder /app/entrypoint.prod.sh ./entrypoint.prod.sh

RUN npm ci

ENTRYPOINT [ "/app/entrypoint.prod.sh" ]
