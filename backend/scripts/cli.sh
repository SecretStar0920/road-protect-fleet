set -x
COMMAND="${1}"
./docker-exec.sh "node dist/cli/cli.js ${COMMAND}"
