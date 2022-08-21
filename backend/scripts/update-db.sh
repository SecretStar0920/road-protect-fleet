set -x
title='db-update'
echo "What is the title of the update? Eg: CreateUserTable"
read title
./generate-migration.sh "$title"
#./cli.sh "database:migrate"
