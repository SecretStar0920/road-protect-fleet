set -x
COMMAND="${1}";
./typeorm-cli.sh "migration:generate -n ${COMMAND}"
sudo chown -R $USER "../src/modules/shared/modules/database/migrations"
