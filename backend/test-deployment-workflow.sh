#!/bin/bash

set -x

# Run wait to ensure that everything is running before we start
/wait

/bin/bash -c "$@"
