FROM bircow/dapperdox:1.1.1

WORKDIR /go/src/dapperdox-1.1.1

COPY ./assets/ ./assets
COPY ./swagger/ ./swagger
COPY ./dapperdox ./dapperdox
COPY ./setup-dapperdox.sh ./setup-dapperdox.sh
RUN chmod +x setup-dapperdox.sh

EXPOSE 3123

ENTRYPOINT "/go/src/dapperdox-1.1.1/setup-dapperdox.sh" "${BACKEND_URL}" "${DOCUMENTATION_URL}"

