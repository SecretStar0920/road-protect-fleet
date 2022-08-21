#!/usr/bin/env bash
echo "This script will update the images and deployments for the staging server"
echo "Please make sure "
export AUTO_DEPLOY=$1
if [[ ! $AUTO_DEPLOY == yes ]]; then
    read -p "Are you sure you want to continue? [yn]  " answer
fi
if [[ $answer == y || $AUTO_DEPLOY == yes ]]; then
    ./update-backend.sh
    ./update-frontend.sh
#    ./update-document-api.sh
#    ./update-document-renderer.sh
fi

echo
if [[ ! $AUTO_DEPLOY == yes ]]; then
    read -p "Do you want to run migrations on the database? [yn]  " answer
fi
if [[ $answer == y || $AUTO_DEPLOY == yes ]]; then
    ./migrate-database.sh
fi
