FROM node:12.20.0 as builder
ENV NODE_ENV build

WORKDIR /app

COPY ./*.json ./
RUN npm ci

COPY ./src ./src
COPY .browserslistrc express.js ./

RUN node --max_old_space_size=4096 ./node_modules/@angular/cli/bin/ng build --prod

FROM node:12.20.0
ENV NODE_ENV production

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/express.js ./

# Serve
ENTRYPOINT [ "node" ]
CMD [ "express.js"]
