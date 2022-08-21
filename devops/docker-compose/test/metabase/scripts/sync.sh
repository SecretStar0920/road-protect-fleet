set -x
POD_NAME=$(kubectl get pods --template '{{range .items}}{{.metadata.name}}{{"\n"}}{{end}}' | grep "metabase")

echo "Syncing Prod Metabase DB to local"
kubectl cp "${POD_NAME}":/metabase-data ../metabase-data
#
echo "Copying db files to volume"
REGEX='"Mountpoint": "(.*)"'
VOLUME_INFO=$(docker volume inspect rp-dev_metabase-data)
RESULT=$( echo "$VOLUME_INFO" | pcregrep -o1 "$REGEX")

sudo rsync -a "$(pwd)"/../metabase-data/metabase.db/ "${RESULT}"/metabase.db/
