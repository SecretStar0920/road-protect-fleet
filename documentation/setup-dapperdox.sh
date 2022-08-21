#!/bin/bash

_backend_url="${1}"
_bind_address="${2}"

./dapperdox \
    -spec-dir=./swagger \
    -log-level=info \
    -force-specification-list=false \
    -theme=roadprotect-theme  \
    -spec-rewrite-url=api/v1=${_backend_url}/api/v1 \
    -document-rewrite-url=BACKEND_HOST_NAME=http://"${_backend_url}" \
    -author-show-assets=false
