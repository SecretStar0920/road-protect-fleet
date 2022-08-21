echo "1. Building"
docker build . --tag stable-chrome-node-image

echo
echo "2. Tagging"
docker tag stable-chrome-node-image eu.gcr.io/fleet-260107/chrome-node-image

echo
echo "3. Pushing: eu.gcr.io/fleet-260107/chrome-node-image"
docker push eu.gcr.io/fleet-260107/chrome-node-image
