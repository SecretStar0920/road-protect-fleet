#!/usr/bin/env bash
usage() {
    echo "
    Usage: $0 [-h] [-e <ENV_FILE_PATH>] [-s <SECRET_NAME>] [-o <OUTPUT_PATH>]

    Description: Generates a Kubernetes secret from an env file

    where:
        -h                      shows this help text
        -e <ENV_FILE_PATH>      path to the env you want to convert
        -s <SECRET_NAME>        name of the secret that will be appended to <name>.secret.yaml

     " 1>&2
    exit 1
}

while getopts ":h:e:s:o:" o; do
    case "${o}" in
    h)
        usage
        ;;
    e)
        ENV_PATH=${OPTARG}
        ;;
    s)
        SECRET_NAME=${OPTARG}
        ;;
    *) ;;

    esac
done
shift $((OPTIND - 1))

if [[ -z "${ENV_PATH}" ]] && [[ -z "${SECRET_NAME}" ]]; then
    echo "
    No arguments provided
    "
    usage
elif [[ -z "${ENV_PATH}" ]]; then
    echo "
    Missing ENV_PATH
    "
    usage
elif [[ -z "${SECRET_NAME}" ]]; then
    echo "
    Missing SECRET_NAME
    "
    usage
else
    ENV=$(grep -E -v '^#' "${ENV_PATH}" | xargs)
    if [[ -z "${ENV}" ]]; then
        echo "
        NO ENV FOUND AT ${ENV_PATH}
        "
    else
        CURRENT_CONTEXT=$(kubectl config current-context)
        echo "Creating K8s secret ${SECRET_NAME} from ${ENV_PATH} on ${CURRENT_CONTEXT}"
        kubectl delete secret "${SECRET_NAME}"
        kubectl create secret generic "${SECRET_NAME}" --from-env-file="${ENV_PATH}"
    fi
fi
