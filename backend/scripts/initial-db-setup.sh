set -x
./cli.sh database:drop
./cli.sh database:sync
#./cli.sh database:migrate This doesn't work because sync already creates the data, need to figure this out
./cli.sh database:seed
