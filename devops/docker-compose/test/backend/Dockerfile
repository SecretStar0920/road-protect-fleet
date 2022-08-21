FROM node:14.17.0

WORKDIR /app

COPY ./*.json ./

RUN npm install

COPY . .

ENTRYPOINT [ "/bin/bash" ]

CMD [ "test-entrypoint.sh" ]
