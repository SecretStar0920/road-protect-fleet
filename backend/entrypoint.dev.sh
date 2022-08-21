#!/bin/bash

cd /app
service clamav-daemon start
npm run start:dev
