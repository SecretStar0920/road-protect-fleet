#!/usr/bin/env bash

BUILD_SERVICE='crawler-api'
SERVICE='ocr'
TAG='stable'

echo "TAG=${TAG}"
echo "SERVICE=${SERVICE}"
echo "BUILD_SERVICE=${BUILD_SERVICE}"
echo

CURRENT_PATH="$(
    cd "$(dirname "$0")" || exit
    pwd -P
)"
cd "${CURRENT_PATH}"/../ || exit

echo
if [[ ! $AUTO_DEPLOY == yes ]]; then
    read -p "1. Generate secrets? [yn]" answer
fi
if [[ $answer == y ]]; then
    ./generate-secret.sh -e ./../${SERVICE}/.env -s ${SERVICE}
fi

echo
echo "2. Building"
cd "${CURRENT_PATH}"/../../../../../${BUILD_SERVICE}/ || exit
docker build . --tag beta-"${SERVICE}"
#
#echo
#echo "Slimming"
#docker-slim --report=off build --http-probe=false --continue-after=10 beta-"${SERVICE}"

echo
echo "3. Tagging"
docker tag beta-"${SERVICE}" eu.gcr.io/fleet-260107/"${SERVICE}":"${TAG}"

echo
echo "4. Pushing: eu.gcr.io/fleet-260107/${SERVICE}:${TAG}"
docker push eu.gcr.io/fleet-260107/"${SERVICE}":"${TAG}"

echo
echo "5. Patching the deployment: ${SERVICE}"
cd "$CURRENT_PATH" || exit
./patch-deployment.sh "$SERVICE"
