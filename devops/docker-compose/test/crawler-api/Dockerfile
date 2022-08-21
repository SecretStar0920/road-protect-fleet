FROM eu.gcr.io/fleet-260107/chrome-node-image

WORKDIR /app

COPY ./*.json ./

RUN npm install

COPY . .

ENTRYPOINT [ "npm" ]

CMD [ "run", "start"]
