docker build -t cli-deb-build-2 . && docker run --rm -v "$(pwd)/../..":/app cli-deb-build-2
sudo chown -R $USER "$(pwd)/../"
