set -x
COMMAND="${1}"
./docker-exec.sh "npm run script-runner -- ./node_modules/typeorm/cli.js -f ./dist/modules/shared/modules/database/database.config.js ${COMMAND}"
