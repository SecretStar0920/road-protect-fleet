./cloud_sql_proxy -instances=fleet-260107:europe-west1:fleet-prod-database=tcp:12000 \
    -credential_file=$(pwd)/sql-key.json
